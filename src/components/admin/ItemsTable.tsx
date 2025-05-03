
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { LostItem, FoundItem } from "@/types";

interface ItemsTableProps {
  items: (LostItem | FoundItem)[];
  onVerifyItem: (id: string) => void;
  onRejectItem: (id: string) => void;
  showActions?: boolean;
}

const ItemsTable = ({ 
  items, 
  onVerifyItem, 
  onRejectItem, 
  showActions = true 
}: ItemsTableProps) => {
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "verified":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Verified</Badge>;
      case "claimed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Claimed</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.title}
                </TableCell>
                <TableCell>
                  {item.id.startsWith("lost") ? "Lost" : "Found"}
                </TableCell>
                <TableCell>
                  {renderStatusBadge(item.status)}
                </TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" className="h-8">
                    View
                  </Button>
                  {showActions && item.status === "pending" && (
                    <>
                      <Button 
                        size="sm" 
                        className="h-8"
                        onClick={() => onVerifyItem(item.id)}
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Verify
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8"
                        onClick={() => onRejectItem(item.id)}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemsTable;
