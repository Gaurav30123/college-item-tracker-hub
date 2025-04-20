
import { LostItem, FoundItem, ItemCategory } from "@/types";
import { LOST_ITEMS, FOUND_ITEMS } from "@/utils/mockData";

// Get all lost items
export const getLostItems = () => {
  return [...LOST_ITEMS];
};

// Get all found items
export const getFoundItems = () => {
  return [...FOUND_ITEMS];
};

// Get item by ID and type
export const getItemById = (id: string, type: "lost" | "found"): LostItem | FoundItem | undefined => {
  const items = type === "lost" ? LOST_ITEMS : FOUND_ITEMS;
  return items.find(item => item.id === id);
};

// Search items with filters
export const searchItems = (
  items: LostItem[] | FoundItem[], 
  query: string, 
  filters: { 
    category?: ItemCategory, 
    startDate?: Date, 
    endDate?: Date, 
    location?: string 
  }
) => {
  return items.filter(item => {
    // Filter by search query
    const matchesQuery = !query || 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());
    
    // Filter by category
    const matchesCategory = !filters.category || item.category === filters.category;
    
    // Filter by date range
    const itemDate = new Date(item.date);
    const matchesDateRange = 
      (!filters.startDate || itemDate >= filters.startDate) &&
      (!filters.endDate || itemDate <= filters.endDate);
    
    // Filter by location
    const matchesLocation = !filters.location || item.location === filters.location;
    
    return matchesQuery && matchesCategory && matchesDateRange && matchesLocation;
  });
};

// Add a new lost or found item
export const addItem = (
  item: Omit<LostItem | FoundItem, "id" | "status" | "createdAt">, 
  type: "lost" | "found"
): LostItem | FoundItem => {
  const newItem = {
    ...item,
    id: `${type}-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  } as LostItem | FoundItem;
  
  if (type === "lost") {
    LOST_ITEMS.unshift(newItem as LostItem);
  } else {
    FOUND_ITEMS.unshift(newItem as FoundItem);
  }
  
  return newItem;
};

// Find potential matches for an item
export const findPotentialMatches = (item: LostItem | FoundItem, type: "lost" | "found", limit = 5) => {
  const oppositeType = type === "lost" ? "found" : "lost";
  const oppositeItems = oppositeType === "lost" ? LOST_ITEMS : FOUND_ITEMS;
  
  // Simple matching algorithm based on category and keywords in title/description
  return oppositeItems
    .filter(otherItem => {
      // Match by category
      if (otherItem.category !== item.category) return false;
      
      // Check for keyword matches in title or description
      const itemKeywords = [...item.title.toLowerCase().split(" "), ...item.description.toLowerCase().split(" ")]
        .filter(word => word.length > 3);
      
      const otherItemText = `${otherItem.title.toLowerCase()} ${otherItem.description.toLowerCase()}`;
      
      return itemKeywords.some(keyword => otherItemText.includes(keyword));
    })
    .slice(0, limit);
};
