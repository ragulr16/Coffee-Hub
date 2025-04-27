"use client";

import { Coffee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

// Simulated data
const activities = [
  {
    id: 1,
    type: "log",
    title: "Espresso",
    details: "Double shot, medium roast",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    type: "log",
    title: "Pour Over",
    details: "Ethiopian beans, V60 method",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 3,
    type: "recipe",
    title: "Tried Vanilla Latte Recipe",
    details: "Added to favorites",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 4,
    type: "log",
    title: "Cold Brew",
    details: "House blend, 12oz",
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000), // 28 hours ago
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start space-x-4 p-3 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="bg-primary/10 p-2 rounded-md">
                <Coffee className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <a href="/logs">
            View all activity
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}