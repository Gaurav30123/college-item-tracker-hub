
import React from "react";
import ItemsTable from "@/components/admin/ItemsTable";
import { LostItem, FoundItem } from "@/types";

interface AllItemsTabProps {
  items: (LostItem | FoundItem)[];
  onVerifyItem: (id: string) => void;
  onRejectItem: (id: string) => void;
}

const AllItemsTab = ({ 
  items, 
  onVerifyItem, 
  onRejectItem 
}: AllItemsTabProps) => {
  return (
    <div className="space-y-4">
      <ItemsTable 
        items={items} 
        onVerifyItem={onVerifyItem} 
        onRejectItem={onRejectItem}
        showActions={false}
      />
    </div>
  );
};

export default AllItemsTab;
