
import { Link } from "react-router-dom";
import { 
  Calendar, MapPin, Tag, AlertCircle, CheckCircle, Clock, 
  ExternalLink, MoreHorizontal, User
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LostItem, FoundItem } from "@/types";

interface ItemCardProps {
  item: LostItem | FoundItem;
  itemType: "lost" | "found";
  showActions?: boolean;
}

export default function ItemCard({ item, itemType, showActions = true }: ItemCardProps) {
  // Function to render status badge with appropriate color
  const renderStatusBadge = () => {
    switch(item.status) {
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

  // Function to get specific details based on item type
  const getSpecificDetails = () => {
    if (itemType === "lost" && "lastSeen" in item) {
      return (
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <AlertCircle className="mr-1 h-4 w-4" />
          <span>Last seen: {item.lastSeen}</span>
        </div>
      );
    } else if (itemType === "found" && "whereFound" in item) {
      return (
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <CheckCircle className="mr-1 h-4 w-4" />
          <span>Found at: {item.whereFound}</span>
        </div>
      );
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold line-clamp-1">{item.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <time dateTime={item.date}>
              {new Date(item.date).toLocaleDateString()}
            </time>
          </div>
        </div>
        {renderStatusBadge()}
      </CardHeader>
      
      <CardContent className="p-4 pt-2 flex-grow">
        {item.image && (
          <div className="aspect-video overflow-hidden rounded-md mb-3">
            <img 
              src={item.image} 
              alt={item.title} 
              className="object-cover w-full h-full" 
            />
          </div>
        )}
        
        <p className="text-sm line-clamp-2 mb-2">{item.description}</p>
        
        <div className="flex flex-col gap-1 mt-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Tag className="mr-1 h-4 w-4" />
            <span>{item.category}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{item.location}</span>
          </div>
          
          {getSpecificDetails()}
          
          {"reward" in item && item.reward && (
            <div className="flex items-center text-sm font-medium text-green-600 mt-1">
              <span>Reward: {item.reward}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Clock className="mr-1 h-4 w-4" />
            <span>Posted {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/${itemType}-items/${item.id}`}>
              View Details
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Contact reporter
              </DropdownMenuItem>
              <DropdownMenuItem>
                {itemType === "lost" ? "I found this" : "I lost this"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                Report listing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      )}
    </Card>
  );
}
