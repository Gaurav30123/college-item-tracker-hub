
// Item category types
export type ItemCategory = 
  | "Electronics" 
  | "Books/Notes" 
  | "Clothing" 
  | "Accessories" 
  | "ID/Cards" 
  | "Keys" 
  | "Other";

// Status of a lost or found item
export type ItemStatus = "pending" | "verified" | "claimed" | "resolved";

// Base item interface
export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  date: string;
  image?: string;
  status: ItemStatus;
  contactInfo: string;
  userId: string;
  createdAt: string;
}

// Lost item extends the base item
export interface LostItem extends Item {
  lastSeen: string;
  reward?: string;
}

// Found item extends the base item
export interface FoundItem extends Item {
  whereFound: string;
  storedLocation?: string;
}

// Mock user interface
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
