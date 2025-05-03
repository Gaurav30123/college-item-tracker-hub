
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LOST_ITEMS, FOUND_ITEMS } from "@/utils/mockData";
import { LostItem, FoundItem, User, SupportMessage } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Import Admin Components
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import PendingItemsTab from "@/components/admin/PendingItemsTab";
import AllItemsTab from "@/components/admin/AllItemsTab";
import SupportMessagesTab from "@/components/admin/SupportMessagesTab";
import SearchBar from "@/components/admin/SearchBar";

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingItems, setPendingItems] = useState<(LostItem | FoundItem)[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<(LostItem | FoundItem)[]>([]);
  const [activeTab, setActiveTab] = useState("pending");

  // Check if current user is admin
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData) as User;
        if (user.isAdmin) {
          setIsAdmin(true);
        } else {
          // Redirect non-admin users
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/");
      }
    } else {
      // No user data, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  // Get all pending items
  useEffect(() => {
    const allPendingItems = [
      ...LOST_ITEMS.filter(item => item.status === "pending"),
      ...FOUND_ITEMS.filter(item => item.status === "pending")
    ];
    setPendingItems(allPendingItems);
    setFilteredItems(allPendingItems);
    
    // Mock support messages
    setSupportMessages([
      {
        id: "msg-1",
        userId: "user-123",
        userName: "John Smith",
        email: "john.smith@example.com",
        subject: "Item Claim Issue",
        message: "I've found my lost laptop but can't claim it through the system.",
        createdAt: "2025-04-30T15:32:00.000Z",
        status: "unread"
      },
      {
        id: "msg-2",
        userId: "user-456",
        userName: "Emily Johnson",
        email: "emily.j@example.com",
        subject: "Wrong Item Category",
        message: "I submitted my report with the wrong category. Can you please change it?",
        createdAt: "2025-05-01T09:15:00.000Z",
        status: "unread"
      },
      {
        id: "msg-3",
        userId: "user-789",
        userName: "Michael Chen",
        email: "m.chen@example.com",
        subject: "Request to Delete Report",
        message: "I found my item myself and would like to delete my report.",
        createdAt: "2025-05-02T14:20:00.000Z",
        status: "read"
      }
    ]);
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = pendingItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(pendingItems);
    }
  }, [searchQuery, pendingItems]);
  
  // Handle verify item
  const handleVerifyItem = (id: string) => {
    // In a real app, this would make an API call to update the item status
    toast({
      title: "Item Verified",
      description: `Item ${id} has been verified successfully.`
    });
    
    // Send notification to user
    sendNotification(id, "verified");
  };
  
  // Handle reject item
  const handleRejectItem = (id: string) => {
    // In a real app, this would make an API call to update the item status
    toast({
      title: "Item Rejected",
      description: `Item ${id} has been rejected.`
    });
  };
  
  // Handle mark message as read
  const handleMarkAsRead = (id: string) => {
    setSupportMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id ? { ...msg, status: msg.status === "unread" ? "read" : "unread" } : msg
      )
    );
    
    toast({
      title: "Message Status Updated",
      description: "Message status has been updated."
    });
  };
  
  // Handle reply to message
  const handleReplyMessage = (id: string) => {
    // In a real app, this would open a modal to compose a reply
    toast({
      title: "Reply Function",
      description: `Reply to message ${id} functionality would open here.`
    });
  };
  
  // Send notification to user
  const sendNotification = (itemId: string, action: string) => {
    // In a real app, this would send an email/notification to the user
    console.log(`Sending notification for item ${itemId}, action: ${action}`);
    toast({
      title: "Notification Sent",
      description: `User has been notified about their ${action} item.`
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need administrator permissions to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-10">
        <AdminHeader />
        
        <AdminStats 
          pendingItemsCount={pendingItems.length}
          unreadMessagesCount={supportMessages.filter(msg => msg.status === "unread").length}
          totalLostItemsCount={LOST_ITEMS.length}
          totalFoundItemsCount={FOUND_ITEMS.length}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Items</TabsTrigger>
            <TabsTrigger value="support">Support Messages</TabsTrigger>
            <TabsTrigger value="all">All Items</TabsTrigger>
          </TabsList>
          
          <SearchBar
            placeholder={activeTab === "support" ? "Search messages..." : "Search items..."}
            value={searchQuery}
            onChange={setSearchQuery}
          />
          
          <TabsContent value="pending" className="space-y-4">
            <PendingItemsTab 
              items={filteredItems}
              onVerifyItem={handleVerifyItem}
              onRejectItem={handleRejectItem}
            />
          </TabsContent>
          
          <TabsContent value="support" className="space-y-4">
            <SupportMessagesTab
              messages={supportMessages}
              onMarkAsRead={handleMarkAsRead}
              onReplyMessage={handleReplyMessage}
            />
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <AllItemsTab 
              items={[...LOST_ITEMS, ...FOUND_ITEMS].slice(0, 10)}
              onVerifyItem={handleVerifyItem}
              onRejectItem={handleRejectItem}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
