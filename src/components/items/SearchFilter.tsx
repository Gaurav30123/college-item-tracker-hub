
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Calendar, Tag, MapPin, Filter, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CATEGORIES, LOCATIONS } from "@/utils/mockData";

interface SearchFilterProps {
  onSearch: (query: string, filters: any) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialStartDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
  const initialEndDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;
  
  // State for search form
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if there are any active filters
  const hasActiveFilters = !!(category || location || startDate || endDate);
  
  // Apply search
  const applySearch = () => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("q", query);
    if (category) newParams.set("category", category);
    if (location) newParams.set("location", location);
    if (startDate) newParams.set("startDate", startDate.toISOString().split("T")[0]);
    if (endDate) newParams.set("endDate", endDate.toISOString().split("T")[0]);
    
    setSearchParams(newParams);
    
    onSearch(query, {
      category: category || undefined,
      location: location || undefined,
      startDate,
      endDate,
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setCategory("");
    setLocation("");
    setStartDate(undefined);
    setEndDate(undefined);
    
    const newParams = new URLSearchParams();
    if (query) newParams.set("q", query);
    setSearchParams(newParams);
    
    onSearch(query, {});
  };
  
  // Apply search on initial load
  useEffect(() => {
    applySearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for lost or found items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && applySearch()}
          />
        </div>
        
        <Button onClick={applySearch}>
          Search
        </Button>
        
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && !showFilters && (
            <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="grid gap-4 p-4 border rounded-md bg-card">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Filter Options</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-sm"
              >
                <X className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Category filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Category</label>
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Location filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Location</label>
              </div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All locations</SelectItem>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date range filter */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Date Range</label>
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => endDate ? date > endDate : false}
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {endDate ? format(endDate, "MMM dd, yyyy") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => startDate ? date < startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowFilters(false)}>
              Close
            </Button>
            <Button onClick={applySearch}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
      
      {/* Active filters display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2 p-2">
          {category && (
            <div className="flex items-center gap-1 text-sm bg-accent px-2 py-1 rounded-full">
              <Tag className="h-3 w-3" />
              <span>{CATEGORIES.find(c => c.value === category)?.label || category}</span>
              <button 
                onClick={() => {
                  setCategory("");
                  applySearch();
                }}
                className="ml-1 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {location && (
            <div className="flex items-center gap-1 text-sm bg-accent px-2 py-1 rounded-full">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
              <button 
                onClick={() => {
                  setLocation("");
                  applySearch();
                }}
                className="ml-1 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {startDate && endDate && (
            <div className="flex items-center gap-1 text-sm bg-accent px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              <span>{format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}</span>
              <button 
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                  applySearch();
                }}
                className="ml-1 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {(startDate && !endDate) && (
            <div className="flex items-center gap-1 text-sm bg-accent px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              <span>From {format(startDate, "MMM d, yyyy")}</span>
              <button 
                onClick={() => {
                  setStartDate(undefined);
                  applySearch();
                }}
                className="ml-1 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {(endDate && !startDate) && (
            <div className="flex items-center gap-1 text-sm bg-accent px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              <span>Until {format(endDate, "MMM d, yyyy")}</span>
              <button 
                onClick={() => {
                  setEndDate(undefined);
                  applySearch();
                }}
                className="ml-1 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
