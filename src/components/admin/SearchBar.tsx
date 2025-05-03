
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ placeholder, value, onChange }: SearchBarProps) => {
  return (
    <div className="flex w-full items-center space-x-2 mb-4">
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="flex-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
