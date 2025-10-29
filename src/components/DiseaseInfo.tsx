import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Shield, Pill } from "lucide-react";

const DiseaseInfo = () => {
  const { data: diseases, isLoading } = useQuery({
    queryKey: ["diseases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diseases")
        .select("*")
        .order("severity", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  return (
    <section id="diseases" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Common Diseases & Prevention
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn about symptoms, prevention methods, and treatment options for common health conditions
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseases?.map((disease) => (
              <Card 
                key={disease.id} 
                className="p-6 hover:shadow-lg transition-shadow duration-300 bg-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{disease.name}</h3>
                  <Badge className={getSeverityColor(disease.severity)} variant="outline">
                    {disease.severity}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <h4 className="font-semibold text-sm">Symptoms</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{disease.symptoms}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-secondary" />
                      <h4 className="font-semibold text-sm">Prevention</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{disease.prevention}</p>
                  </div>

                  {disease.treatment && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="w-4 h-4 text-primary" />
                        <h4 className="font-semibold text-sm">Treatment</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{disease.treatment}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DiseaseInfo;
