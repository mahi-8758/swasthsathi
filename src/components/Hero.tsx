import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Shield } from "lucide-react";

interface HeroProps {
  onChatOpen: () => void;
}

const Hero = ({ onChatOpen }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center space-y-8">
          <div className="flex justify-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10 animate-pulse">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div className="p-3 rounded-full bg-secondary/10 animate-pulse delay-100">
              <Shield className="w-8 h-8 text-secondary" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            AI-Powered Health Awareness
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              For Everyone, Everywhere
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get instant answers about diseases, symptoms, prevention, and vaccination schedules. 
            Our AI chatbot provides reliable health information in simple language.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={onChatOpen}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Health Chat
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('diseases')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-primary/20 hover:bg-primary/5"
            >
              Learn About Diseases
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 AI Assistance</h3>
              <p className="text-muted-foreground text-sm">Get health information anytime, anywhere</p>
            </div>
            
            <div className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Reliable Information</h3>
              <p className="text-muted-foreground text-sm">Evidence-based health guidance</p>
            </div>
            
            <div className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy to Understand</h3>
              <p className="text-muted-foreground text-sm">Simple language for everyone</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
