import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/auth.store.ts";
import { LogOut, User, PlusCircle, Settings } from "lucide-react";

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Blog App
        </Link>

        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-foreground/80 hover:text-foreground">
            Home
          </Link>
          <Link
            to="/posts"
            className="text-foreground/80 hover:text-foreground"
          >
            Posts
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/create" className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Write
                </Link>
              </Button>

              <Button asChild variant="ghost" size="sm">
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex items-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  {user?.name || user?.username}
                </Link>
              </Button>

              {user?.role === "ADMIN" && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin" className="flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild size="sm">
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
