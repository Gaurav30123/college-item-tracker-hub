
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Camera, Upload } from "lucide-react";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function ImageUpload({ imagePreview, onImageUpload, onRemoveImage }: ImageUploadProps) {
  return (
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
          onChange={onImageUpload}
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
              onClick={onRemoveImage}
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
