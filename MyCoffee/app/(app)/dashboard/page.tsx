import { CoffeeIcon, BarChart3Icon, ListTodoIcon, BookOpenIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { QuickLogForm } from "@/components/logging/quick-log-form";
import { DailyCaffeineChart } from "@/components/dashboard/daily-caffeine-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { BrewRecommendations } from "@/components/dashboard/brew-recommendations";

export default function DashboardPage() {
  const greeting = "Coffee Lover";
  
  return (
    <div className="container-brew animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {greeting}</h1>
          <p className="text-muted-foreground">Track, brew, and discover your perfect cup of coffee.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button asChild>
            <a href="/logs/new">
              <CoffeeIcon className="mr-2 h-4 w-4" />
              New Log
            </a>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <CoffeeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caffeine Today</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247mg</div>
            <p className="text-xs text-muted-foreground">of 400mg daily goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Recipes</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">3 custom recipes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brew Guides</CardTitle>
            <ListTodoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 completed this week</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Daily Caffeine Intake</CardTitle>
                <CardDescription>Your caffeine consumption over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyCaffeineChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Quick Log</CardTitle>
                <CardDescription>Quickly log your coffee intake</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickLogForm />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent coffee logs and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Personalized brewing suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <BrewRecommendations />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed insights into your coffee habits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analytics features coming soon. Check back for detailed insights about your coffee consumption patterns, brewing preferences, and more.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Your complete coffee journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full activity feed coming soon. This will show your complete history of logs, recipes tried, and brewing guides followed.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}