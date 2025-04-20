
import { Button } from "@/components/ui/button";

interface ItemTypeSelectorProps {
  itemType: "lost" | "found";
  onTypeChange: (type: "lost" | "found") => void;
}

export function ItemTypeSelector({ itemType, onTypeChange }: ItemTypeSelectorProps) {
  return (
    <div className="flex space-x-2 mb-6">
      <Button
        type="button"
        variant={itemType === "lost" ? "default" : "outline"}
        className="flex-1"
        onClick={() => onTypeChange("lost")}
      >
        I Lost Something
      </Button>
      <Button
        type="button"
        variant={itemType === "found" ? "default" : "outline"}
        className="flex-1"
        onClick={() => onTypeChange("found")}
      >
        I Found Something
      </Button>
    </div>
  );
}
