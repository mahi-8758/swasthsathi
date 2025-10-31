import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Hero from "@/components/Hero";
import Chatbot from "@/components/Chatbot";
import DiseaseInfo from "@/components/DiseaseInfo";
import VaccinationSchedule from "@/components/VaccinationSchedule";
import HealthAlerts from "@/components/HealthAlerts";
import ContactUs from "@/components/ContactUs";
import RibbonBar from "@/components/RibbonBar";
import GoogleTranslateWidget from "@/components/GoogleTranslateWidget";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold text-foreground">🏥 SWASTH SATHI</h1>
          <div className="flex gap-2 items-center">
            <GoogleTranslateWidget />
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => navigate("/health-records")} 
                  variant="outline" 
                  size="sm"
                  className="hidden sm:flex"
                >
                  My Records
                </Button>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline" size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <RibbonBar />

      <Hero onChatOpen={() => setIsChatOpen(true)} />
      
      <HealthAlerts />
      
      <DiseaseInfo />
      
      <VaccinationSchedule />
      
      <ContactUs />
      
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl bg-secondary hover:bg-secondary/90 z-40"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 AI Health Awareness Platform. Providing reliable health information to everyone, everywhere.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Always consult healthcare professionals for medical advice and treatment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
