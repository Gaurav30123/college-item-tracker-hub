
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User as UserType } from "@/types";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lost-items?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col">
                <Link to="/" className="px-2 py-4 text-lg font-bold">
                  CampusFind
                </Link>
                <nav className="flex flex-col gap-4 mt-4">
                  <Link to="/" className="text-lg font-semibold hover:underline">
                    Home
                  </Link>
                  <Link to="/lost-items" className="text-lg font-semibold hover:underline">
                    Lost Items
                  </Link>
                  <Link to="/found-items" className="text-lg font-semibold hover:underline">
                    Found Items
                  </Link>
                  <Link to="/report" className="text-lg font-semibold hover:underline">
                    Report Item
                  </Link>
                  {user?.isAdmin && (
                    <Link to="/admin" className="text-lg font-semibold hover:underline">
                      Admin Dashboard
                    </Link>
                  )}
                  {isLoggedIn ? (
                    <Link to="/profile" className="text-lg font-semibold hover:underline">
                      My Profile
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="text-lg font-semibold hover:underline">
                        Login
                      </Link>
                      <Link to="/signup" className="text-lg font-semibold hover:underline">
                        Sign Up
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">CampusFind</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/lost-items" className="text-sm font-medium transition-colors hover:text-primary">
            Lost Items
          </Link>
          <Link to="/found-items" className="text-sm font-medium transition-colors hover:text-primary">
            Found Items
          </Link>
          <Link to="/report" className="text-sm font-medium transition-colors hover:text-primary">
            Report Item
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">
              Admin Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="icon" variant="ghost" className="absolute right-0 top-0" type="submit">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>

          {isLoggedIn ? (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/login">
                <LogIn className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
