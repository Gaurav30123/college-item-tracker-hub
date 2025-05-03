
import React from "react";
import SupportMessagesTable from "@/components/admin/SupportMessagesTable";
import { SupportMessage } from "@/types";

interface SupportMessagesTabProps {
  messages: SupportMessage[];
  onMarkAsRead: (id: string) => void;
  onReplyMessage: (id: string) => void;
}

const SupportMessagesTab = ({ 
  messages, 
  onMarkAsRead, 
  onReplyMessage 
}: SupportMessagesTabProps) => {
  return (
    <div className="space-y-4">
      <SupportMessagesTable
        messages={messages}
        onMarkAsRead={onMarkAsRead}
        onReplyMessage={onReplyMessage}
      />
    </div>
  );
};

export default SupportMessagesTab;
