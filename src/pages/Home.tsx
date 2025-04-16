
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Upload, List, Bell, Eye, CheckCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import ItemCard from "@/components/items/ItemCard";
import { LOST_ITEMS, FOUND_ITEMS, CATEGORIES } from "@/utils/mockData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get recent lost and found items
  const recentLostItems = LOST_ITEMS.slice(0, 3);
  const recentFoundItems = FOUND_ITEMS.slice(0, 3);
  
  // Get total stats
  const totalLost = LOST_ITEMS.length;
  const totalFound = FOUND_ITEMS.length;
  const totalClaimed = [...LOST_ITEMS, ...FOUND_ITEMS].filter(item => item.status === "claimed").length;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Lost or Found Something?
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Our campus lost and found platform helps you recover lost items and return found items to their owners.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/report">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-200">
                      <Upload className="mr-2 h-5 w-5" />
                      Report an Item
                    </Button>
                  </Link>
                  <Link to="/lost-items">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600">
                      <Search className="mr-2 h-5 w-5" />
                      Find Lost Items
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Quick Search</CardTitle>
                      <CardDescription>
                        Search for lost or found items
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/lost-items?q=${searchQuery}`; }}>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <input
                            type="search"
                            placeholder="What are you looking for?"
                            className="w-full rounded-md border border-input bg-background px-9 py-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <Button 
                            type="submit" 
                            size="sm" 
                            className="absolute right-1 top-1"
                          >
                            Search
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="border-t pt-4 pb-2">
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.slice(0, 5).map((category) => (
                          <Link 
                            key={category.value} 
                            to={`/lost-items?category=${category.value}`}
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-gray-100"
                          >
                            {category.label}
                          </Link>
                        ))}
                        <Link 
                          to={`/lost-items`}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-gray-100"
                        >
                          More...
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats section */}
        <section className="py-12 border-b">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-center">{totalLost}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center mb-2">
                    <Bell className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-sm font-medium">Items Currently Lost</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-center">{totalFound}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center mb-2">
                    <Eye className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-sm font-medium">Items Found</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-center">{totalClaimed}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-sm font-medium">Items Successfully Claimed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent items section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Recent Items</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/lost-items">View All Lost</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/found-items">View All Found</Link>
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="lost" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="lost">Recently Lost</TabsTrigger>
                  <TabsTrigger value="found">Recently Found</TabsTrigger>
                </TabsList>
                <TabsContent value="lost" className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentLostItems.map((item) => (
                      <ItemCard key={item.id} item={item} itemType="lost" />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="found" className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentFoundItems.map((item) => (
                      <ItemCard key={item.id} item={item} itemType="found" />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Call to action section */}
        <section className="py-12 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 shrink-0">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Report an Item</h3>
                      <p className="text-sm text-gray-500">
                        Lost something? Found something? Report it with details and image.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 shrink-0">
                      <List className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Browse Listings</h3>
                      <p className="text-sm text-gray-500">
                        Search through lost and found items with powerful filters.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 shrink-0">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Get Notified</h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications when matching items are found.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Claim Your Item</h3>
                      <p className="text-sm text-gray-500">
                        Contact the finder and get your lost item back.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-center lg:items-start">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>Contact our support team for assistance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Lost & Found Office Hours: Mon-Fri, 9am-5pm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Location: Student Center, Room 101</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Contact Support</Button>
                  </CardFooter>
                </Card>
                <Link to="/report" className="w-full">
                  <Button className="w-full" size="lg">
                    Report an Item Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="#" className="underline underline-offset-4 hover:text-foreground">Terms</Link>
            <Link to="#" className="underline underline-offset-4 hover:text-foreground">Privacy</Link>
            <Link to="#" className="underline underline-offset-4 hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
