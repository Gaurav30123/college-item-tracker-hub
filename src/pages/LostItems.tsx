
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import SearchFilter from "@/components/items/SearchFilter";
import ItemCard from "@/components/items/ItemCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LOST_ITEMS, searchItems } from "@/utils/mockData";
import { LostItem } from "@/types";
import { Plus } from "lucide-react";

export default function LostItems() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || undefined;
  
  const [filteredItems, setFilteredItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial search based on URL parameters
  useEffect(() => {
    const filters = {
      category: initialCategory as any,
    };
    
    setFilteredItems(searchItems(LOST_ITEMS, initialQuery, filters) as LostItem[]);
    setLoading(false);
  }, [initialQuery, initialCategory]);

  // Handle search and filter
  const handleSearch = (query: string, filters: any) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setFilteredItems(searchItems(LOST_ITEMS, query, filters) as LostItem[]);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lost Items</h1>
            <p className="text-muted-foreground">
              Browse through items that have been reported as lost on campus.
            </p>
          </div>
          
          <Button asChild>
            <Link to="/report?type=lost" className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Report Lost Item
            </Link>
          </Button>
        </div>
        
        <div className="mb-8">
          <SearchFilter onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[350px] rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} itemType="lost" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No lost items found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        )}
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
