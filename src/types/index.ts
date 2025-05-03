
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

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
}

// Support message interface
export interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "read" | "unread";
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "item_found" | "item_claimed" | "item_verified" | "system";
  itemId?: string;
  createdAt: string;
  read: boolean;
}
