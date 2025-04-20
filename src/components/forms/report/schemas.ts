
import { z } from "zod";
import { CATEGORIES } from "@/utils/mockData";
import { ItemCategory } from "@/types";

// Schema for both lost and found items
export const baseItemSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.enum(CATEGORIES.map(c => c.value) as [ItemCategory, ...ItemCategory[]]),
  location: z.string().min(1, { message: "Please select a location" }),
  date: z.string().min(1, { message: "Please select a date" }),
  contactInfo: z.string().email({ message: "Please enter a valid email address" }),
});

// Schema specific to lost items
export const lostItemSchema = baseItemSchema.extend({
  itemType: z.literal("lost"),
  lastSeen: z.string().min(3, { message: "Please provide where you last saw the item" }),
  reward: z.string().optional(),
});

// Schema specific to found items
export const foundItemSchema = baseItemSchema.extend({
  itemType: z.literal("found"),
  whereFound: z.string().min(3, { message: "Please provide where you found the item" }),
  storedLocation: z.string().optional(),
});

// Combined schema with discriminated union
export const reportItemSchema = z.discriminatedUnion("itemType", [
  lostItemSchema,
  foundItemSchema,
]);

export type ReportItemFormValues = z.infer<typeof reportItemSchema>;
