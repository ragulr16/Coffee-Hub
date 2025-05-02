"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CoffeeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BrewMethod, CoffeeType } from "@/lib/types";

const quickLogSchema = z.object({
  coffeeType: z.string().min(1, "Coffee type is required"),
  brewMethod: z.string().min(1, "Brew method is required"),
  servingSize: z.coerce.number().min(1, "Serving size must be at least 1"),
  servingUnit: z.string().min(1, "Unit is required"),
});

type QuickLogFormValues = z.infer<typeof quickLogSchema>;

const brewMethods: BrewMethod[] = [];
const coffeeTypes: CoffeeType[] = [];
const servingUnits: string[] = [];

export function QuickLogForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOptions, setIsFetchingOptions] = useState(true);
  const [options, setOptions] = useState({
    coffeeTypes: [] as CoffeeType[],
    brewMethods: [] as BrewMethod[],
    servingUnits: [] as string[]
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsFetchingOptions(true);
        const response = await fetch('/api/options');
        if (!response.ok) {
          throw new Error('Failed to fetch options');
        }
        const data = await response.json();
        setOptions({
          coffeeTypes: data.coffeeTypes || [],
          brewMethods: data.brewMethods || [],
          servingUnits: data.servingUnits || ['oz', 'ml', 'cup', 'shot']
        });
      } catch (error) {
        console.error('Error fetching options:', error);
        // Fallback to default options if API fails
        setOptions({
          coffeeTypes: [],
          brewMethods: [],
          servingUnits: ['oz', 'ml', 'cup', 'shot']
        });
      } finally {
        setIsFetchingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const { toast } = useToast();
  const { getToken } = useAuth();
  const form = useForm<QuickLogFormValues>({
    resolver: zodResolver(quickLogSchema),
    defaultValues: {
      coffeeType: "",
      brewMethod: "",
      servingSize: 8,
      servingUnit: "oz",
    },
  });

  async function onSubmit(data: QuickLogFormValues) {
    setIsLoading(true);
    
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      console.log('Sending request with token:', token);
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: data.servingSize,
          type: `${data.coffeeType} (${data.brewMethod})`,
          notes: ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log coffee');
      }

      // Show success toast
      toast({
        title: "Coffee logged successfully!",
        description: `Logged ${data.servingSize} ${data.servingUnit} of ${data.coffeeType} (${data.brewMethod})`,
      });
      
      // Reset form
      form.reset({
        coffeeType: "",
        brewMethod: "",
        servingSize: 8,
        servingUnit: "oz",
      });
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast({
        title: "Error logging coffee",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="coffeeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coffee Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coffee type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.coffeeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brewMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brew Method</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brew method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.brewMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="servingSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serving Size</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="8"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="servingUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.servingUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging...
            </span>
          ) : (
            <span className="flex items-center">
              <CoffeeIcon className="mr-2 h-4 w-4" />
              Log Coffee
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
