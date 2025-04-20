
import { Link } from "react-router-dom";
import { Home, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto rounded-full bg-yellow-100 p-3 w-16 h-16 flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-4">Page Not Found</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/lost-items">
                <Search className="mr-2 h-5 w-5" />
                Search Lost Items
              </Link>
            </Button>
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
