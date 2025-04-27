"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { CoffeeIcon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/logs",
      label: "Coffee Logs",
      active: pathname === "/logs",
    },
    {
      href: "/recipes",
      label: "Recipes",
      active: pathname === "/recipes",
    },
    {
      href: "/guides",
      label: "Brew Guides",
      active: pathname === "/guides",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-brew flex h-16 items-center">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <CoffeeIcon className="h-6 w-6 text-coffee-brown" />
            <span className="hidden font-bold text-xl text-coffee-text-primary sm:inline-block">
              BrewLog
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden mx-6 items-center space-x-4 md:flex md:space-x-6 lg:space-x-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                route.active
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <nav className="container-brew py-4 space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={closeMenu}
                className={cn(
                  "block py-2 text-base font-medium transition-colors hover:text-foreground/80",
                  route.active
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 border-t">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}