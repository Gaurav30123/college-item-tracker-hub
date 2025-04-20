import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { LostItem, FoundItem } from "@/types";

import { reportItemSchema, type ReportItemFormValues } from "./report/schemas";
import { ImageUpload } from "./report/ImageUpload";
import { ItemTypeSelector } from "./report/ItemTypeSelector";
import { BasicDetails } from "./report/BasicDetails";
import { TypeSpecificFields } from "./report/TypeSpecificFields";

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
    
    const submissionData = {
      ...data,
      userId: "user-123",
      image: imagePreview || undefined
    };
    
    // Show success message
    toast({
      title: "Item Reported",
      description: `Your ${itemType} item has been reported successfully.`,
    });
    
    // Call onSubmit prop if provided
    if (onSubmit) {
      onSubmit(submissionData);
    }
    
    setIsSubmitting(false);
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
