
import React from "react";
import StatCard from "@/components/admin/StatCard";
import { AlertCircle, MessageSquare } from "lucide-react";

interface AdminStatsProps {
  pendingItemsCount: number;
  unreadMessagesCount: number;
  totalLostItemsCount: number;
  totalFoundItemsCount: number;
}

const AdminStats = ({ 
  pendingItemsCount,
  unreadMessagesCount,
  totalLostItemsCount,
  totalFoundItemsCount
}: AdminStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-4 mb-8">
      <StatCard
        title="Pending Items"
        value={pendingItemsCount}
        description="Items awaiting verification"
        icon={<AlertCircle className="h-4 w-4 text-yellow-500" />}
      />
      
      <StatCard
        title="Support Messages"
        value={unreadMessagesCount}
        description="Unread support messages"
        icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
      />
      
      <StatCard
        title="Total Lost Items"
        value={totalLostItemsCount}
        description="Total lost items reported"
        iconColor="text-red-500"
      />
      
      <StatCard
        title="Total Found Items"
        value={totalFoundItemsCount}
        description="Total found items reported"
        iconColor="text-blue-500"
      />
    </div>
  );
};

export default AdminStats;
