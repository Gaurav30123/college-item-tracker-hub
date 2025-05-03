
import React from "react";
import ItemsTable from "@/components/admin/ItemsTable";
import { LostItem, FoundItem } from "@/types";

interface PendingItemsTabProps {
  items: (LostItem | FoundItem)[];
  onVerifyItem: (id: string) => void;
  onRejectItem: (id: string) => void;
}

const PendingItemsTab = ({ 
  items, 
  onVerifyItem, 
  onRejectItem 
}: PendingItemsTabProps) => {
  return (
    <div className="space-y-4">
      <ItemsTable 
        items={items} 
        onVerifyItem={onVerifyItem} 
        onRejectItem={onRejectItem}
        showActions={true}
      />
    </div>
  );
};

export default PendingItemsTab;
