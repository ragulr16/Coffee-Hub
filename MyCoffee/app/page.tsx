import Link from 'next/link';
import { CoffeeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-coffee-cream">
      <div className="container-brew flex flex-col items-center justify-center min-h-screen text-center animate-fade-in">
        <div className="p-4 mb-8">
          <CoffeeIcon size={64} className="text-coffee-brown mx-auto" />
          <h1 className="text-5xl font-bold mt-6 text-coffee-text-primary">BrewLog</h1>
          <p className="text-xl mt-4 text-coffee-text-secondary max-w-2xl mx-auto">
            Your personal coffee companion. Track your caffeine, discover new recipes, and perfect your brewing techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full max-w-5xl">
          <FeatureCard 
            title="Track Your Coffee"
            description="Log your daily coffee intake and monitor caffeine consumption with detailed analytics."
            delay="0"
          />
          <FeatureCard 
            title="Discover Recipes"
            description="Browse and save coffee recipes from around the world or create your own unique brews."
            delay="100"
          />
          <FeatureCard 
            title="Perfect Your Brew"
            description="Follow guided brewing techniques with interactive timers for consistent results every time."
            delay="200"
          />
        </div>

        <div className="mt-12 space-x-4">
          <Button asChild className="bg-coffee-brown hover:bg-coffee-brown/90 text-white">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown/10">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, delay }: { title: string; description: string; delay: string }) {
  return (
    <div 
      className="brew-card bg-white animate-slide-in" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-xl font-semibold text-coffee-text-primary mb-2">{title}</h2>
      <p className="text-coffee-text-secondary">{description}</p>
    </div>
  );
}