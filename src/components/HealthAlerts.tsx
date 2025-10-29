import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, MapPin, Bell, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const locationSchema = z.object({
  state: z.string().trim().min(1, "State is required").max(100),
  district: z.string().trim().min(1, "District is required").max(100),
});

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const HealthAlerts = () => {
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState(() => 
    localStorage.getItem("userState") || "Uttarakhand"
  );
  const [selectedDistrict, setSelectedDistrict] = useState(() => 
    localStorage.getItem("userDistrict") || "Dehradun"
  );
  const [tempState, setTempState] = useState(selectedState);
  const [tempDistrict, setTempDistrict] = useState(selectedDistrict);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["health-alerts", selectedState, selectedDistrict],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("health_alerts")
        .select("*")
        .eq("active", true)
        .order("severity", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Filter alerts based on selected location
      return data.filter(alert => {
        if (!alert.location) return true;
        const alertLocation = alert.location.toLowerCase();
        const userState = selectedState.toLowerCase();
        const userDistrict = selectedDistrict.toLowerCase();
        
        return alertLocation.includes(userState) || 
               alertLocation.includes(userDistrict) ||
               alertLocation.includes("all");
      });
    },
  });

  const handleEditClick = () => {
    setTempState(selectedState);
    setTempDistrict(selectedDistrict);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTempState(selectedState);
    setTempDistrict(selectedDistrict);
    setIsEditing(false);
  };

  const handleSaveLocation = () => {
    try {
      const validation = locationSchema.safeParse({
        state: tempState,
        district: tempDistrict,
      });

      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      setSelectedState(tempState);
      setSelectedDistrict(tempDistrict);
      localStorage.setItem("userState", tempState);
      localStorage.setItem("userDistrict", tempDistrict);
      setIsEditing(false);
      
      toast({
        title: "Location Saved",
        description: `Alerts will be shown for ${tempDistrict}, ${tempState}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      });
    }
  };

  const getSeverityConfig = (severity: string) => {
    const configs = {
      critical: {
        color: "bg-destructive/10 text-destructive border-destructive/20",
        icon: "🚨"
      },
      urgent: {
        color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
        icon: "⚠️"
      },
      warning: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
        icon: "⚡"
      },
      info: {
        color: "bg-primary/10 text-primary border-primary/20",
        icon: "ℹ️"
      },
    };
    return configs[severity as keyof typeof configs] || configs.info;
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8 animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-muted" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="h-4 w-64 bg-muted rounded" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!alerts || alerts.length === 0) return null;

  return (
    <section id="health-alerts" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg animate-pulse">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Health Alerts
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Stay informed about local health updates</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 border border-primary/20 shadow-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {selectedDistrict}, {selectedState}
              </span>
            </div>
            
            <Button
              onClick={isEditing ? handleCancelEdit : handleEditClick}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium">
                {isEditing ? "Cancel" : "Change Location"}
              </span>
            </Button>
          </div>
        </div>

        {isEditing && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-background to-muted/50 border-2 border-primary/20 shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Set Your Location
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={tempState} onValueChange={setTempState}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  type="text"
                  placeholder="Enter district"
                  value={tempDistrict}
                  onChange={(e) => setTempDistrict(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>
            <Button
              onClick={handleSaveLocation}
              className="mt-4 w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Location
            </Button>
          </Card>
        )}

        <div className="mb-6 p-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl border border-primary/20 shadow-md animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-secondary/30">
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-sm font-medium">
              📍 Showing personalized alerts for <strong className="text-primary">{selectedDistrict}, {selectedState}</strong>
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert, index) => {
            const config = getSeverityConfig(alert.severity);
            return (
              <Card 
                key={alert.id} 
                className="group relative overflow-hidden p-6 hover:shadow-2xl transition-all duration-500 hover-scale border-2 animate-fade-in hover:border-primary/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl animate-pulse">{config.icon}</div>
                    <Badge className={`${config.color} shadow-md transition-transform duration-300 group-hover:scale-110`} variant="outline">
                      {alert.severity}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {alert.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {alert.description}
                  </p>
                  
                  {alert.location && (
                    <div className="flex items-center gap-2 mt-4 p-2 rounded-lg bg-muted/50">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">{alert.location}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HealthAlerts;
