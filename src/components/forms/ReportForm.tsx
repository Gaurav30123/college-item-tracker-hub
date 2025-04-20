
import { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { CATEGORIES, LOCATIONS } from "@/utils/mockData";
import { ItemCategory, LostItem, FoundItem } from "@/types";

// Schema for both lost and found items
const baseItemSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.enum(CATEGORIES.map(c => c.value) as [ItemCategory, ...ItemCategory[]]),
  location: z.string().min(1, { message: "Please select a location" }),
  date: z.string().min(1, { message: "Please select a date" }),
  contactInfo: z.string().email({ message: "Please enter a valid email address" }),
});

// Schema specific to lost items
const lostItemSchema = baseItemSchema.extend({
  itemType: z.literal("lost"),
  lastSeen: z.string().min(3, { message: "Please provide where you last saw the item" }),
  reward: z.string().optional(),
});

// Schema specific to found items
const foundItemSchema = baseItemSchema.extend({
  itemType: z.literal("found"),
  whereFound: z.string().min(3, { message: "Please provide where you found the item" }),
  storedLocation: z.string().optional(),
});

// Combined schema with discriminated union
const reportItemSchema = z.discriminatedUnion("itemType", [
  lostItemSchema,
  foundItemSchema,
]);

type ReportItemFormValues = z.infer<typeof reportItemSchema>;

interface ReportFormProps {
  defaultType?: "lost" | "found";
  onSubmit?: (data: Omit<LostItem | FoundItem, "id" | "status" | "createdAt">) => void;
}

export default function ReportForm({ defaultType = "lost", onSubmit }: ReportFormProps) {
  const [itemType, setItemType] = useState<"lost" | "found">(defaultType);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form with validation
  const form = useForm<ReportItemFormValues>({
    resolver: zodResolver(reportItemSchema),
    defaultValues: {
      itemType,
      title: "",
      description: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
      contactInfo: "",
      ...(itemType === "lost" 
        ? { lastSeen: "", reward: "" } 
        : { whereFound: "", storedLocation: "" }),
    },
  });

  // Update form when item type changes
  const changeItemType = (type: "lost" | "found") => {
    setItemType(type);
    form.setValue("itemType", type);
    
    // Clear type-specific fields
    if (type === "lost") {
      form.setValue("lastSeen", "");
      form.setValue("reward", "");
    } else {
      form.setValue("whereFound", "");
      form.setValue("storedLocation", "");
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const handleSubmit = (data: ReportItemFormValues) => {    
    setIsSubmitting(true);
    
    // Add timestamp and other properties
    const submissionData = {
      ...data,
      image: imagePreview || undefined // Add image if exists
    };
    
    console.log("Form submitted:", submissionData);
    
    // Show success message
    toast({
      title: "Item Reported",
      description: `Your ${itemType} item has been reported successfully.`,
    });
    
    // Call onSubmit prop if provided
    if (onSubmit) {
      onSubmit(submissionData);
    }
    
    // Reset form
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex space-x-2 mb-6">
        <Button
          type="button"
          variant={itemType === "lost" ? "default" : "outline"}
          className="flex-1"
          onClick={() => changeItemType("lost")}
        >
          I Lost Something
        </Button>
        <Button
          type="button"
          variant={itemType === "found" ? "default" : "outline"}
          className="flex-1"
          onClick={() => changeItemType("found")}
        >
          I Found Something
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Blue Backpack" {...field} />
                </FormControl>
                <FormDescription>
                  Provide a clear, descriptive name for the item
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the item in detail (color, brand, distinctive features, etc.)"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The more details you provide, the easier it will be to identify
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {itemType === "lost" ? "When did you lose it?*" : "When did you find it?*"}
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {itemType === "lost" ? (
            <>
              <FormField
                control={form.control}
                name="lastSeen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where did you last see it?*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 2nd floor library, near the computers"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $20" {...field} />
                    </FormControl>
                    <FormDescription>
                      You can offer a reward to motivate people to help
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="whereFound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where exactly did you find it?*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., On a table in the cafeteria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storedLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where is it now? (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., I gave it to the front desk / I'm keeping it safely"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email*</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@college.edu"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will be used to contact you if someone finds/claims your item
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Upload Image (Optional)</FormLabel>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF, max 5MB
              </p>
            </div>

            {imagePreview && (
              <div className="mt-4 relative">
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setImagePreview(null)}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
