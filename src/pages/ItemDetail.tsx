
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Tag, User, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { LOST_ITEMS, FOUND_ITEMS } from "@/utils/mockData";
import { LostItem, FoundItem } from "@/types";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<LostItem | FoundItem | null>(null);
  const [itemType, setItemType] = useState<"lost" | "found">("lost");
  const [loading, setLoading] = useState(true);
  const [matchItems, setMatchItems] = useState<Array<LostItem | FoundItem>>([]);

  useEffect(() => {
    // Determine if this is a lost or found item based on URL path
    const path = window.location.pathname;
    const isLost = path.includes("/lost-items/");
    setItemType(isLost ? "lost" : "found");
    
    // Find the item in the appropriate array
    const itemArray = isLost ? LOST_ITEMS : FOUND_ITEMS;
    const foundItem = itemArray.find(item => item.id === id);
    setItem(foundItem || null);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // Find potential matches (simplified)
    if (foundItem) {
      const oppositeArray = isLost ? FOUND_ITEMS : LOST_ITEMS;
      const potentialMatches = oppositeArray
        .filter(i => i.category === foundItem.category)
        .slice(0, 3);
      setMatchItems(potentialMatches);
    }
  }, [id]);

  // Render status badge with appropriate color
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

  const handleClaimItem = () => {
    toast({
      title: "Claim Request Sent",
      description: "We've notified the reporter. They will contact you soon.",
    });
  };

  const handleContactOwner = () => {
    toast({
      title: "Contact Information Copied",
      description: "The contact email has been copied to your clipboard.",
    });
    
    if (item?.contactInfo) {
      navigator.clipboard.writeText(item.contactInfo).catch(err => {
        console.error("Could not copy text: ", err);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-6 px-4 md:py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-6 px-4 md:py-10">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Item Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild variant="outline">
              <Link to={`/${itemType}-items`}>Back to {itemType} items</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
              <p className="text-muted-foreground">
                {itemType === "lost" ? "Lost item" : "Found item"} · Reported on {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {renderStatusBadge(item.status)}
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Item details */}
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {item.image && (
                  <div className="rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full object-cover max-h-[400px]"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Description</h3>
                    <p className="mt-1">{item.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Category</h4>
                        <p>{item.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Location</h4>
                        <p>{item.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Date</h4>
                        <p>{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {itemType === "lost" && "lastSeen" in item && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">Last Seen</h4>
                          <p>{item.lastSeen}</p>
                        </div>
                      </div>
                    )}
                    
                    {itemType === "found" && "whereFound" in item && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">Where Found</h4>
                          <p>{item.whereFound}</p>
                        </div>
                      </div>
                    )}
                    
                    {"reward" in item && item.reward && (
                      <div className="flex items-start gap-2 col-span-2">
                        <div>
                          <h4 className="font-medium text-sm">Reward</h4>
                          <p className="text-green-600 font-medium">{item.reward}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex flex-wrap gap-3">
                <Button onClick={handleClaimItem}>
                  {itemType === "lost" ? "I Found This Item" : "This is My Item"}
                </Button>
                <Button variant="outline" onClick={handleContactOwner}>
                  Contact Reporter
                </Button>
              </CardFooter>
            </Card>
            
            {/* Reporter info */}
            <Card>
              <CardHeader>
                <CardTitle>Reporter Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Reported By</h4>
                      <p>Campus User #{item.userId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Contact Email</h4>
                      <p>{item.contactInfo}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Possible matches */}
            {matchItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Potential Matches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {matchItems.map((matchItem) => (
                    <div key={matchItem.id} className="border rounded-md p-3 hover:bg-gray-50">
                      <Link to={`/${itemType === "lost" ? "found" : "lost"}-items/${matchItem.id}`} className="block">
                        <h4 className="font-medium">{matchItem.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Tag className="h-4 w-4" />
                          <span>{matchItem.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{matchItem.location}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/${itemType === "lost" ? "found" : "lost"}-items?category=${item.category}`}>
                      View All Potential Matches
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleClaimItem}>
                  {itemType === "lost" ? "I Found This Item" : "This is My Item"}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleContactOwner}>
                  Contact Reporter
                </Button>
                <Button variant="outline" className="w-full">
                  Share Item
                </Button>
                <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                  Report Problem
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
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
