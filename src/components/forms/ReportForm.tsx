
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { LostItem, FoundItem } from "@/types";

import { reportItemSchema, type ReportItemFormValues } from "./report/schemas";
import { ImageUpload } from "./report/ImageUpload";
import { ItemTypeSelector } from "./report/ItemTypeSelector";
import { BasicDetails } from "./report/BasicDetails";
import { TypeSpecificFields } from "./report/TypeSpecificFields";
import { uploadImage } from "@/services/itemService";

interface ReportFormProps {
  defaultType?: "lost" | "found";
  onSubmit?: (data: Omit<LostItem | FoundItem, "id" | "status" | "createdAt">) => void;
}

export default function ReportForm({ defaultType = "lost", onSubmit }: ReportFormProps) {
  const [itemType, setItemType] = useState<"lost" | "found">(defaultType);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Create form with validation
  const form = useForm<ReportItemFormValues>({
    resolver: zodResolver(reportItemSchema),
    defaultValues: {
      itemType,
      title: "",
      description: "",
      category: undefined,
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
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate a UUID for testing purposes
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Form submission handler
  const handleSubmit = async (data: ReportItemFormValues) => {    
    setIsSubmitting(true);
    
    try {
      // Upload image if available
      let imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      // Use a proper UUID format instead of a string
      const tempUserId = generateUUID();
      
      // Make sure all required fields are present for the submission
      const submissionData = {
        ...data,
        userId: tempUserId, // Using UUID format instead of "user-123"
        image: imageUrl || imagePreview || undefined,
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        date: data.date,
        contactInfo: data.contactInfo
      };
      
      // Show success message
      toast({
        title: "Item Reported",
        description: `Your ${itemType} item has been reported successfully.`,
      });
      
      // Call onSubmit prop if provided
      if (onSubmit) {
        onSubmit(submissionData as Omit<LostItem | FoundItem, "id" | "status" | "createdAt">);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ItemTypeSelector itemType={itemType} onTypeChange={changeItemType} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <BasicDetails form={form} itemType={itemType} />
          <TypeSpecificFields form={form} itemType={itemType} />
          
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

          <ImageUpload
            imagePreview={imagePreview}
            onImageUpload={handleImageUpload}
            onRemoveImage={() => setImagePreview(null)}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
