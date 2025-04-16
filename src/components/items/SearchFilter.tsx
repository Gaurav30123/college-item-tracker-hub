
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { CATEGORIES, LOCATIONS } from "@/utils/mockData";
import { ItemCategory } from "@/types";

interface FilterOptions {
  category?: ItemCategory;
  location?: string;
  dateStart?: string;
  dateEnd?: string;
  status?: string;
}

interface SearchFilterProps {
  onSearch: (query: string, filters: FilterOptions) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [tempFilters, setTempFilters] = useState<FilterOptions>({});
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const handleFilterApply = () => {
    setFilters(tempFilters);
    setIsFilterActive(
      Boolean(
        tempFilters.category || 
        tempFilters.location || 
        tempFilters.dateStart || 
        tempFilters.dateEnd || 
        tempFilters.status
      )
    );
    onSearch(query, tempFilters);
  };

  const handleFilterReset = () => {
    setTempFilters({});
    setFilters({});
    setIsFilterActive(false);
    onSearch(query, {});
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={handleSearch} className="flex w-full gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for items..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              type="button" 
              variant={isFilterActive ? "default" : "outline"} 
              className="gap-1"
            >
              <Filter className="h-4 w-4" />
              Filters
              {isFilterActive && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 text-xs flex items-center justify-center">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Items</SheetTitle>
            </SheetHeader>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={tempFilters.category || ""}
                  onValueChange={(value) => 
                    setTempFilters({
                      ...tempFilters,
                      category: value as ItemCategory || undefined
                    })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={tempFilters.location || ""}
                  onValueChange={(value) => 
                    setTempFilters({
                      ...tempFilters,
                      location: value || undefined
                    })
                  }
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateStart">Date Range (From)</Label>
                <Input
                  id="dateStart"
                  type="date"
                  value={tempFilters.dateStart || ""}
                  onChange={(e) => 
                    setTempFilters({
                      ...tempFilters,
                      dateStart: e.target.value || undefined
                    })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateEnd">Date Range (To)</Label>
                <Input
                  id="dateEnd"
                  type="date"
                  value={tempFilters.dateEnd || ""}
                  onChange={(e) => 
                    setTempFilters({
                      ...tempFilters,
                      dateEnd: e.target.value || undefined
                    })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={tempFilters.status || ""}
                  onValueChange={(value) => 
                    setTempFilters({
                      ...tempFilters,
                      status: value || undefined
                    })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="claimed">Claimed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <SheetFooter className="flex flex-row gap-2 sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleFilterReset}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <SheetClose asChild>
                <Button
                  type="button"
                  onClick={handleFilterApply}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        <Button type="submit">
          Search
        </Button>
      </form>
      
      {isFilterActive && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="outline" className="flex items-center gap-1">
              Category: {filters.category}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.category;
                  setFilters(newFilters);
                  setTempFilters(newFilters);
                  setIsFilterActive(Object.values(newFilters).some(Boolean));
                  onSearch(query, newFilters);
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          )}
          
          {filters.location && (
            <Badge variant="outline" className="flex items-center gap-1">
              Location: {filters.location}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.location;
                  setFilters(newFilters);
                  setTempFilters(newFilters);
                  setIsFilterActive(Object.values(newFilters).some(Boolean));
                  onSearch(query, newFilters);
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          )}
          
          {(filters.dateStart || filters.dateEnd) && (
            <Badge variant="outline" className="flex items-center gap-1">
              Date: {filters.dateStart && new Date(filters.dateStart).toLocaleDateString()}
              {filters.dateStart && filters.dateEnd && " - "}
              {filters.dateEnd && new Date(filters.dateEnd).toLocaleDateString()}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.dateStart;
                  delete newFilters.dateEnd;
                  setFilters(newFilters);
                  setTempFilters(newFilters);
                  setIsFilterActive(Object.values(newFilters).some(Boolean));
                  onSearch(query, newFilters);
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          )}
          
          {filters.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {filters.status}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.status;
                  setFilters(newFilters);
                  setTempFilters(newFilters);
                  setIsFilterActive(Object.values(newFilters).some(Boolean));
                  onSearch(query, newFilters);
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          )}
          
          {isFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleFilterReset}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
