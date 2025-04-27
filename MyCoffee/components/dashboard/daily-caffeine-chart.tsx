"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simulated data
const weeklyData = [
  { name: "Mon", value: 123 },
  { name: "Tue", value: 231 },
  { name: "Wed", value: 175 },
  { name: "Thu", value: 189 },
  { name: "Fri", value: 247 },
  { name: "Sat", value: 302 },
  { name: "Sun", value: 127 },
];

const monthlyData = [
  { name: "Week 1", value: 875 },
  { name: "Week 2", value: 1247 },
  { name: "Week 3", value: 1043 },
  { name: "Week 4", value: 920 },
];

export function DailyCaffeineChart() {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");
  const data = timeRange === "week" ? weeklyData : monthlyData;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as "week" | "month")}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}mg`}
            />
            <Tooltip
              formatter={(value) => [`${value}mg`, "Caffeine"]}
              labelStyle={{ color: "#3B2F2F" }}
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "8px", 
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="pt-2 text-center text-sm text-muted-foreground">
        <p>Recommended daily limit: 400mg</p>
      </div>
    </div>
  );
}