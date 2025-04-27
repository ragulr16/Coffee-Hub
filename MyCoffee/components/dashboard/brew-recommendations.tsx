"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simulated recommendations
const recommendations = [
  {
    id: 1,
    title: "Pour Over",
    description: "Based on your recent preferences",
    imageUrl: "https://images.pexels.com/photos/6542569/pexels-photo-6542569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    title: "Aeropress",
    description: "Try this brewing method for variety",
    imageUrl: "https://images.pexels.com/photos/9397012/pexels-photo-9397012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    title: "French Press",
    description: "A richer alternative to your usual brew",
    imageUrl: "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

export function BrewRecommendations() {
  return (
    <div className="space-y-4">
      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No recommendations available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div 
              key={recommendation.id}
              className="flex space-x-4 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div 
                className="w-16 h-16 rounded-md bg-cover bg-center flex-shrink-0" 
                style={{ backgroundImage: `url(${recommendation.imageUrl})` }}
              />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{recommendation.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {recommendation.description}
                </p>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary" asChild>
                  <a href={`/guides?method=${recommendation.title.toLowerCase()}`}>
                    View guide
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <a href="/guides">
            Browse all guides
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}