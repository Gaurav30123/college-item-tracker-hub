
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MapPin, Bell } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-24 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6 space-y-10 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Campus Lost & Found
              </h1>
              <p className="text-xl text-muted-foreground mx-auto max-w-3xl">
                The easiest way to report lost items or return found items on campus. 
                Reconnect with your belongings today!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/report?type=lost">
                  I Lost Something <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/report?type=found">
                  I Found Something <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Search Lost Items</h2>
                <p className="text-muted-foreground">
                  Quickly search through all reported lost items to find what you're looking for.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Report Found Items</h2>
                <p className="text-muted-foreground">
                  Report items you've found on campus and help others recover their belongings.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Get Notified</h2>
                <p className="text-muted-foreground">
                  Receive notifications when your item is found or when someone claims a found item.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6 text-center">
            <div className="mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">
                Ready to find your lost items?
              </h2>
              <p className="text-muted-foreground">
                Join our campus community and help everyone reconnect with their lost belongings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/lost-items">Browse Lost Items</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/found-items">Browse Found Items</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
