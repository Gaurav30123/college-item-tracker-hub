
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Item, LostItem, FoundItem } from "@/types";
import { LOST_ITEMS, FOUND_ITEMS, findPotentialMatches } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemCard from "@/components/items/ItemCard";
import {
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle,
  Info,
  Mail,
  ArrowLeft,
  Share2,
  Flag,
} from "lucide-react";

export default function ItemDetail() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<LostItem | FoundItem | null>(null);
  const [itemType, setItemType] = useState<"lost" | "found">("lost");
  const [potentialMatches, setPotentialMatches] = useState<(LostItem | FoundItem)[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    // Determine the correct type and fetch the item
    const foundLostItem = LOST_ITEMS.find(item => item.id === id);
    const foundFoundItem = FOUND_ITEMS.find(item => item.id === id);
    
    if (foundLostItem) {
      setItem(foundLostItem);
      setItemType("lost");
      
      // Find potential matches for this lost item
      const matches = findPotentialMatches(foundLostItem, FOUND_ITEMS);
      setPotentialMatches(matches);
    } else if (foundFoundItem) {
      setItem(foundFoundItem);
      setItemType("found");
      
      // Find potential matches for this found item
      const matches = findPotentialMatches(foundFoundItem, LOST_ITEMS);
      setPotentialMatches(matches);
    } else {
      setNotFound(true);
    }
    
    setLoading(false);
  }, [id, type]);
  
  // Function to render status badge with appropriate color
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
  
  // Render item not found state
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Item Not Found</CardTitle>
              <CardDescription>
                The item you are looking for does not exist or has been removed.
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
  
  // Render loading state
  if (loading || !item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="w-full h-[600px] rounded-lg bg-gray-100 animate-pulse"></div>
        </main>
      </div>
    );
  }
  
  // Specific details based on item type
  const renderSpecificDetails = () => {
    if (itemType === "lost" && "lastSeen" in item) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Last Seen</h4>
              <p>{item.lastSeen}</p>
            </div>
          </div>
          
          {item.reward && (
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Reward Offered</h4>
                <p className="text-green-600 font-medium">{item.reward}</p>
              </div>
            </div>
          )}
        </div>
      );
    } else if (itemType === "found" && "whereFound" in item) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Found At</h4>
              <p>{item.whereFound}</p>
            </div>
          </div>
          
          {item.storedLocation && (
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Currently Stored At</h4>
                <p>{item.storedLocation}</p>
              </div>
            </div>
          )}
        </div>
      );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
            {renderStatusBadge(item.status)}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Reported on {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            {/* Item details card */}
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {item.image && (
                    <div className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold">Description</h3>
                      <p className="mt-2">{item.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">Category</h4>
                          <p>{item.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">Location</h4>
                          <p>{item.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">Date</h4>
                          <p>{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {renderSpecificDetails()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Potential matches */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Potential Matches
              </h2>
              
              {potentialMatches.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {potentialMatches.map((matchItem) => (
                    <ItemCard 
                      key={matchItem.id} 
                      item={matchItem} 
                      itemType={matchItem.id.startsWith("lost") ? "lost" : "found"} 
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No potential matches found for this item yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Actions sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  {itemType === "lost" 
                    ? "Did you find this item?" 
                    : "Is this your lost item?"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Reporter
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {itemType === "lost" 
                        ? "I Found This Item" 
                        : "This Is My Item"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {itemType === "lost" 
                          ? "Claim You Found This Item" 
                          : "Claim This Item Is Yours"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        To proceed with this claim, you'll need to provide details that verify your connection to this item.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Separator />
                
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reporter Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Contact: {item.contactInfo}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please respect the privacy of the reporter and only contact them regarding this item.
                </p>
              </CardContent>
            </Card>
            
            {itemType === "lost" && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Found Items</CardTitle>
                  <CardDescription>
                    These items match your lost item's description
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recent">
                    <TabsList className="w-full">
                      <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
                      <TabsTrigger value="matched" className="flex-1">Matched</TabsTrigger>
                    </TabsList>
                    <div className="mt-4">
                      <TabsContent value="recent">
                        {FOUND_ITEMS.slice(0, 2).map((foundItem) => (
                          <Link 
                            key={foundItem.id} 
                            to={`/found-items/${foundItem.id}`}
                            className="flex items-center gap-3 p-3 hover:bg-muted rounded-md mb-2"
                          >
                            {foundItem.image && (
                              <div className="w-12 h-12 rounded overflow-hidden bg-muted shrink-0">
                                <img 
                                  src={foundItem.image} 
                                  alt={foundItem.title} 
                                  className="object-cover w-full h-full" 
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate">{foundItem.title}</h4>
                              <p className="text-xs text-muted-foreground truncate">
                                {foundItem.location} • {new Date(foundItem.date).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </TabsContent>
                      <TabsContent value="matched">
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          Our system will automatically match similar items as they are reported.
                        </p>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link to="/found-items">View All Found Items</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
