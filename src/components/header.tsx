"use client";

import Link from "next/link";
import { MapPin, Search, User, Bell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <div>
            <h1 className="text-lg font-bold leading-none text-foreground">
              Bhookh<span className="text-primary">Map</span>
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none">
              India ka asli food map
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/map"
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <MapPin className="w-5 h-5 text-foreground" />
          </Link>
          <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-chilli rounded-full" />
          </button>
          <Link
            href="/profile"
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <User className="w-5 h-5 text-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
