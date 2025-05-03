
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupportMessage } from "@/types";

interface SupportMessagesTableProps {
  messages: SupportMessage[];
  onMarkAsRead: (id: string) => void;
  onReplyMessage: (id: string) => void;
}

const SupportMessagesTable = ({
  messages,
  onMarkAsRead,
  onReplyMessage,
}: SupportMessagesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.length > 0 ? (
            messages.map((message) => (
              <TableRow key={message.id} className={message.status === "unread" ? "bg-blue-50" : ""}>
                <TableCell className="font-medium">
                  {message.userName}
                  <div className="text-xs text-muted-foreground">{message.email}</div>
                </TableCell>
                <TableCell>
                  {message.subject}
                </TableCell>
                <TableCell>
                  <Badge variant={message.status === "unread" ? "default" : "outline"}>
                    {message.status === "unread" ? "Unread" : "Read"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(message.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => onMarkAsRead(message.id)}
                  >
                    {message.status === "unread" ? "Mark Read" : "Mark Unread"}
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8"
                    onClick={() => onReplyMessage(message.id)}
                  >
                    Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No support messages found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupportMessagesTable;
