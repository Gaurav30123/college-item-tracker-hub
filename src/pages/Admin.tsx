
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOST_ITEMS, FOUND_ITEMS } from "@/utils/mockData";
import { LostItem, FoundItem, User, SupportMessage } from "@/types";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
        msg.id === id ? { ...msg, status: "read" } : msg
      )
    );
    
    toast({
      title: "Message Status Updated",
      description: "Message marked as read."
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and verify lost and found items on the platform.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Items
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingItems.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Items awaiting verification
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Support Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {supportMessages.filter(msg => msg.status === "unread").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Unread support messages
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Lost Items
              </CardTitle>
              <div className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {LOST_ITEMS.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total lost items reported
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Found Items
              </CardTitle>
              <div className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {FOUND_ITEMS.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total found items reported
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Items</TabsTrigger>
            <TabsTrigger value="support">Support Messages</TabsTrigger>
            <TabsTrigger value="all">All Items</TabsTrigger>
          </TabsList>
          
          <div className="flex w-full items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "support" ? "Search messages..." : "Search items..."}
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <TabsContent value="pending" className="space-y-4">
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
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
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
                          <Button 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleVerifyItem(item.id)}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Verify
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleRejectItem(item.id)}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No pending items found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="support" className="space-y-4">
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
                  {supportMessages.length > 0 ? (
                    supportMessages.map((message) => (
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
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            {message.status === "unread" ? "Mark Read" : "Mark Unread"}
                          </Button>
                          <Button 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleReplyMessage(message.id)}
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
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
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
                  {[...LOST_ITEMS, ...FOUND_ITEMS].slice(0, 10).map((item) => (
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
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-8">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
