
import { LostItem, FoundItem, ItemCategory } from "@/types";

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Get all lost items
export const getLostItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items?itemType=lost`);
    if (!response.ok) {
      throw new Error('Failed to fetch lost items');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching lost items:', error);
    // Fallback to mock data for development
    return [];
  }
};

// Get all found items
export const getFoundItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items?itemType=found`);
    if (!response.ok) {
      throw new Error('Failed to fetch found items');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching found items:', error);
    // Fallback to mock data for development
    return [];
  }
};

// Get item by ID and type
export const getItemById = async (id: string, type: "lost" | "found"): Promise<LostItem | FoundItem | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch item');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} item with ID ${id}:`, error);
    return undefined;
  }
};

// Search items with filters
export const searchItems = async (
  type: "lost" | "found",
  query: string = "", 
  filters: { 
    category?: ItemCategory, 
    startDate?: Date, 
    endDate?: Date, 
    location?: string 
  } = {}
) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('itemType', type);
    
    if (query) {
      params.append('query', query);
    }
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    if (filters.startDate) {
      params.append('startDate', filters.startDate.toISOString().split('T')[0]);
    }
    
    if (filters.endDate) {
      params.append('endDate', filters.endDate.toISOString().split('T')[0]);
    }
    
    if (filters.location) {
      params.append('location', filters.location);
    }
    
    const response = await fetch(`${API_BASE_URL}/items?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search items');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching items:', error);
    return [];
  }
};

// Add a new lost or found item
export const addItem = async (
  item: Omit<LostItem | FoundItem, "id" | "status" | "createdAt">, 
  type: "lost" | "found"
): Promise<LostItem | FoundItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...item,
        itemType: type
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create item');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// Upload an image
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Find potential matches for an item
export const findPotentialMatches = async (id: string, limit = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}/matches`);
    if (!response.ok) {
      throw new Error('Failed to find matches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
};
