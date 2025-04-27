"use client";

import { useState } from "react";
import { PlusCircle, Filter, Search, Calendar, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

// Mock data
const logs = [
  {
    id: "1",
    coffee_type: "Espresso",
    brew_method: "Espresso",
    serving_size: 2,
    serving_unit: "oz",
    timestamp: new Date(2025, 1, 15, 8, 30),
    notes: "Double shot, medium roast",
  },
  {
    id: "2",
    coffee_type: "Ethiopian Light Roast",
    brew_method: "Pour Over",
    serving_size: 12,
    serving_unit: "oz",
    timestamp: new Date(2025, 1, 15, 12, 15),
    notes: "Fruity notes, V60 method",
  },
  {
    id: "3",
    coffee_type: "Columbian Medium Roast",
    brew_method: "French Press",
    serving_size: 16,
    serving_unit: "oz",
    timestamp: new Date(2025, 1, 14, 9, 0),
    notes: "Bold flavor, 4-minute steep",
  },
  {
    id: "4",
    coffee_type: "House Blend",
    brew_method: "Cold Brew",
    serving_size: 10,
    serving_unit: "oz",
    timestamp: new Date(2025, 1, 14, 15, 30),
    notes: "Prepared yesterday, smooth and low acidity",
  },
  {
    id: "5",
    coffee_type: "Dark Roast",
    brew_method: "Moka Pot",
    serving_size: 8,
    serving_unit: "oz",
    timestamp: new Date(2025, 1, 13, 7, 45),
    notes: "Strong and rich flavor",
  },
];

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.coffee_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.brew_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = 
      filterMethod === "all" || 
      log.brew_method.toLowerCase() === filterMethod.toLowerCase();
      
    return matchesSearch && matchesFilter;
  });
  
  // Group logs by date
  const groupedLogs = filteredLogs.reduce((groups, log) => {
    const date = format(log.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, typeof logs>);

  return (
    <div className="container-brew animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coffee Logs</h1>
          <p className="text-muted-foreground">
            Track and manage your coffee consumption
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <a href="/logs/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Log
            </a>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={filterMethod}
            onValueChange={setFilterMethod}
          >
            <SelectTrigger className="min-w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="espresso">Espresso</SelectItem>
              <SelectItem value="pour over">Pour Over</SelectItem>
              <SelectItem value="french press">French Press</SelectItem>
              <SelectItem value="cold brew">Cold Brew</SelectItem>
              <SelectItem value="moka pot">Moka Pot</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          {Object.keys(groupedLogs).length > 0 ? (
            Object.entries(groupedLogs)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, logs]) => (
                <div key={date}>
                  <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h2>
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <Card key={log.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <div className="mr-3 bg-primary/10 p-2 rounded-md">
                                  <Coffee className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{log.coffee_type}</h3>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <span>{log.brew_method}</span>
                                    <span className="mx-2">•</span>
                                    <span>{log.serving_size} {log.serving_unit}</span>
                                  </div>
                                </div>
                              </div>
                              {log.notes && (
                                <p className="text-sm text-muted-foreground mt-2 ml-11">
                                  {log.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {format(log.timestamp, 'h:mm a')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center bg-primary/10 w-16 h-16 rounded-full mb-4">
                <Coffee className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium">No coffee logs found</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Start tracking your coffee consumption by adding your first coffee log.
              </p>
              <Button className="mt-4" asChild>
                <a href="/logs/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Log
                </a>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Calendar view coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}