
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import SearchFilter from "@/components/items/SearchFilter";
import ItemCard from "@/components/items/ItemCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ItemCategory, FoundItem } from "@/types";
import { Plus } from "lucide-react";
import { getFoundItems, searchItems } from "@/services/itemService";

export default function FoundItems() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") as ItemCategory | undefined;
  const initialLocation = searchParams.get("location") || undefined;
  const initialStartDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate") as string) : undefined;
  const initialEndDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate") as string) : undefined;
  
  const [filteredItems, setFilteredItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState<FoundItem[]>([]);

  useEffect(() => {
    // Get all items
    const fetchItems = async () => {
      try {
        const items = await getFoundItems();
        setAllItems(items);
      } catch (error) {
        console.error("Error fetching found items:", error);
        setAllItems([]);
      }
    };
    
    fetchItems();
  }, []);

  // Initial search based on URL parameters
  useEffect(() => {
    if (allItems.length > 0) {
      const filters = {
        category: initialCategory,
        location: initialLocation,
        startDate: initialStartDate,
        endDate: initialEndDate
      };
      
      setLoading(true);
      // Simulate API delay
      setTimeout(async () => {
        try {
          const items = await searchItems("found", initialQuery, filters);
          setFilteredItems(items as FoundItem[]);
        } catch (error) {
          console.error("Error searching items:", error);
          setFilteredItems([]);
        }
        setLoading(false);
      }, 300);
    }
  }, [allItems, initialQuery, initialCategory, initialLocation, initialStartDate, initialEndDate]);

  // Handle search and filter
  const handleSearch = (query: string, filters: any) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(async () => {
      try {
        const items = await searchItems("found", query, filters);
        setFilteredItems(items as FoundItem[]);
      } catch (error) {
        console.error("Error searching items:", error);
        setFilteredItems([]);
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Found Items</h1>
            <p className="text-muted-foreground">
              Browse through items that have been found and reported on campus.
            </p>
          </div>
          
          <Button asChild>
            <Link to="/report?type=found" className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Report Found Item
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
              <ItemCard key={item.id} item={item} itemType="found" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No found items match your search</h3>
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
