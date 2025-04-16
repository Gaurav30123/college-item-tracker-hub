
import { ItemCategory, LostItem, FoundItem, User } from "@/types";

// Mock Categories with icons
export const CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
  { value: "Electronics", label: "Electronics", icon: "laptop" },
  { value: "Books/Notes", label: "Books/Notes", icon: "book-open" },
  { value: "Clothing", label: "Clothing", icon: "shirt" },
  { value: "Accessories", label: "Accessories", icon: "watch" },
  { value: "ID/Cards", label: "ID/Cards", icon: "credit-card" },
  { value: "Keys", label: "Keys", icon: "key" },
  { value: "Other", label: "Other", icon: "more-horizontal" },
];

// Mock Locations on campus
export const LOCATIONS = [
  "Library",
  "Student Center",
  "Science Building",
  "Cafeteria",
  "Gym",
  "Dorm A",
  "Dorm B",
  "Lecture Hall",
  "Parking Lot",
  "Computer Lab",
  "Other"
];

// Mock Users
export const USERS: User[] = [
  {
    id: "user1",
    name: "John Student",
    email: "john@college.edu",
    isAdmin: false,
  },
  {
    id: "user2",
    name: "Emily Staff",
    email: "emily@college.edu",
    isAdmin: false,
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@college.edu",
    isAdmin: true,
  },
];

// Mock Lost Items
export const LOST_ITEMS: LostItem[] = [
  {
    id: "lost1",
    title: "MacBook Pro",
    description: "13-inch MacBook Pro (2019) with stickers on the cover",
    category: "Electronics",
    location: "Library",
    date: "2023-04-10",
    image: "/placeholder.svg",
    status: "pending",
    contactInfo: "john@college.edu",
    userId: "user1",
    lastSeen: "Second floor study area",
    reward: "$50",
    createdAt: "2023-04-10T14:30:00Z",
  },
  {
    id: "lost2",
    title: "Student ID Card",
    description: "College ID card with name 'Emily Johnson'",
    category: "ID/Cards",
    location: "Cafeteria",
    date: "2023-04-12",
    status: "pending",
    contactInfo: "emily@college.edu",
    userId: "user2",
    lastSeen: "Near the salad bar",
    createdAt: "2023-04-12T12:15:00Z",
  },
  {
    id: "lost3",
    title: "Physics Textbook",
    description: "Physics 101 textbook with notes inside",
    category: "Books/Notes",
    location: "Science Building",
    date: "2023-04-08",
    status: "resolved",
    contactInfo: "john@college.edu",
    userId: "user1",
    lastSeen: "Room 302",
    createdAt: "2023-04-08T16:45:00Z",
  },
  {
    id: "lost4",
    title: "Blue Hydroflask",
    description: "32oz blue water bottle with college sticker",
    category: "Other",
    location: "Gym",
    date: "2023-04-15",
    image: "/placeholder.svg",
    status: "pending",
    contactInfo: "emily@college.edu",
    userId: "user2",
    lastSeen: "Near treadmills",
    createdAt: "2023-04-15T18:20:00Z",
  },
];

// Mock Found Items
export const FOUND_ITEMS: FoundItem[] = [
  {
    id: "found1",
    title: "Calculator",
    description: "TI-84 Plus graphing calculator",
    category: "Electronics",
    location: "Science Building",
    date: "2023-04-11",
    image: "/placeholder.svg",
    status: "verified",
    contactInfo: "admin@college.edu",
    userId: "admin1",
    whereFound: "Room 201 desk",
    storedLocation: "Lost & Found Office",
    createdAt: "2023-04-11T10:30:00Z",
  },
  {
    id: "found2",
    title: "Black Umbrella",
    description: "Folding black umbrella with wooden handle",
    category: "Accessories",
    location: "Library",
    date: "2023-04-13",
    status: "pending",
    contactInfo: "john@college.edu",
    userId: "user1",
    whereFound: "First floor entrance",
    createdAt: "2023-04-13T17:45:00Z",
  },
  {
    id: "found3",
    title: "Student ID Card",
    description: "ID card for Emily Johnson",
    category: "ID/Cards",
    location: "Cafeteria",
    date: "2023-04-14",
    status: "claimed",
    contactInfo: "admin@college.edu",
    userId: "admin1",
    whereFound: "On a table near the exit",
    storedLocation: "Lost & Found Office",
    createdAt: "2023-04-14T13:20:00Z",
  },
];

// Mock function to search for items
export function searchItems(items: (LostItem | FoundItem)[], query: string = "", filters: {
  category?: ItemCategory;
  location?: string;
  dateStart?: string;
  dateEnd?: string;
  status?: string;
} = {}) {
  return items.filter(item => {
    // Search by query (item title and description)
    const matchesQuery = query === "" ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());

    // Filter by category
    const matchesCategory = !filters.category || item.category === filters.category;

    // Filter by location
    const matchesLocation = !filters.location || item.location === filters.location;

    // Filter by date range
    const matchesDate = (!filters.dateStart || new Date(item.date) >= new Date(filters.dateStart)) &&
      (!filters.dateEnd || new Date(item.date) <= new Date(filters.dateEnd));

    // Filter by status
    const matchesStatus = !filters.status || item.status === filters.status;

    return matchesQuery && matchesCategory && matchesLocation && matchesDate && matchesStatus;
  });
}

// Mock function to find matches between lost and found items
export function findPotentialMatches(item: LostItem | FoundItem, items: (LostItem | FoundItem)[]) {
  return items
    .filter(otherItem => 
      // Only consider items of the opposite type (lost vs found)
      ((item.id.startsWith("lost") && otherItem.id.startsWith("found")) || 
       (item.id.startsWith("found") && otherItem.id.startsWith("lost"))) &&
      // Basic matching criteria
      item.category === otherItem.category &&
      (item.location === otherItem.location || true) && // More lenient on location
      Math.abs(new Date(item.date).getTime() - new Date(otherItem.date).getTime()) < 7 * 24 * 60 * 60 * 1000 // Within a week
    )
    .sort((a, b) => {
      // Score based on similarity
      const scoreA = (a.category === item.category ? 3 : 0) +
                    (a.location === item.location ? 2 : 0) +
                    (Math.abs(new Date(a.date).getTime() - new Date(item.date).getTime()) < 3 * 24 * 60 * 60 * 1000 ? 1 : 0);
      
      const scoreB = (b.category === item.category ? 3 : 0) +
                    (b.location === item.location ? 2 : 0) +
                    (Math.abs(new Date(b.date).getTime() - new Date(item.date).getTime()) < 3 * 24 * 60 * 60 * 1000 ? 1 : 0);
      
      return scoreB - scoreA;
    });
}

// Mock current user
export const CURRENT_USER: User = USERS[0];
