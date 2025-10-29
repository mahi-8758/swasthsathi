import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Syringe, Calendar, Info } from "lucide-react";

const VaccinationSchedule = () => {
  const { data: vaccinations, isLoading } = useQuery({
    queryKey: ["vaccinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vaccinations")
        .select("*")
        .order("age_group", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="vaccination" className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
            <Syringe className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Vaccination Schedule
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay protected with timely vaccinations. Check the recommended schedule for all age groups
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vaccinations?.map((vaccination) => (
              <Card 
                key={vaccination.id} 
                className="p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-card to-card/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{vaccination.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{vaccination.age_group}</span>
                    </div>
                  </div>
                  {vaccination.required && (
                    <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                      Required
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Schedule
                    </h4>
                    <p className="text-sm text-muted-foreground">{vaccination.schedule}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <Info className="w-4 h-4 text-secondary" />
                      About
                    </h4>
                    <p className="text-sm text-muted-foreground">{vaccination.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/10">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Vaccination schedules may vary based on local health guidelines</li>
            <li>• Consult with healthcare providers for personalized vaccination plans</li>
            <li>• Keep a vaccination record card to track all doses received</li>
            <li>• Some vaccines require booster doses for continued protection</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default VaccinationSchedule;
