"use client";

import { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { CoffeeIcon } from "lucide-react";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-coffee-cream py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <CoffeeIcon size={48} className="text-coffee-brown mb-4" />
        <h1 className="text-3xl font-bold text-coffee-text-primary">
          Join BrewLog
        </h1>
        <p className="mt-2 text-coffee-text-secondary">
          Create your account to start tracking your coffee journey
        </p>
      </div>
      
      <div className="w-full max-w-md brew-card bg-white">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "shadow-none",
              formButtonPrimary: "bg-coffee-brown hover:bg-coffee-brown/90",
              formFieldInput: "border-coffee-text-secondary/30 focus:border-coffee-brown",
              footerActionLink: "text-coffee-brown hover:text-coffee-brown/90",
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}