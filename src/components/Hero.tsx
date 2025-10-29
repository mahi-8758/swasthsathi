import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Shield } from "lucide-react";

interface HeroProps {
  onChatOpen: () => void;
}

const Hero = ({ onChatOpen }: HeroProps) => {
  return (
    <section id="hero" className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      
      {/* Animated Blobs - Enhanced */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary/40 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-secondary/40 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-secondary/40 rounded-full animate-float animation-delay-3000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-accent/40 rounded-full animate-float animation-delay-4000"></div>
      </div>

      {/* Grid Pattern with Animation */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          <div className="flex justify-center gap-4 mb-6 animate-fade-in">
            <div className="p-3 rounded-full bg-primary/10 animate-pulse shadow-lg shadow-primary/20 backdrop-blur-md border border-primary/20">
              <Heart className="w-8 h-8 text-primary animate-heartbeat" />
            </div>
            <div className="p-3 rounded-full bg-secondary/10 animate-pulse animation-delay-2000 shadow-lg shadow-secondary/20 backdrop-blur-md border border-secondary/20">
              <Shield className="w-8 h-8 text-secondary animate-bounce animation-delay-2000" />
            </div>
          </div>
          
          <div className="space-y-4 animate-fade-in animation-delay-1000">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              🏥 AI-Powered Health Awareness
              <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-shift">
                For Everyone, Everywhere
              </span>
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-2000">
            ✨ Get instant answers about diseases, symptoms, prevention, and vaccination schedules. 
            Our AI chatbot provides reliable health information in simple language.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-3000">
            <Button 
              size="lg" 
              onClick={onChatOpen}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary/20"
            >
              <MessageCircle className="mr-2 h-5 w-5 animate-pulse" />
              Start Health Chat
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('diseases')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Learn About Diseases
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-md shadow-lg hover:shadow-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in animation-delay-1000">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <MessageCircle className="w-6 h-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="font-semibold text-lg mb-2">⏰ 24/7 AI Assistance</h3>
              <p className="text-muted-foreground text-sm">Get health information anytime, anywhere with our intelligent chatbot</p>
            </div>
            
            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-md shadow-lg hover:shadow-2xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in animation-delay-2000">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                <Shield className="w-6 h-6 text-secondary group-hover:animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h3 className="font-semibold text-lg mb-2">🔐 Reliable Information</h3>
              <p className="text-muted-foreground text-sm">Evidence-based health guidance from trusted medical sources</p>
            </div>
            
            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-md shadow-lg hover:shadow-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in animation-delay-3000">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <Heart className="w-6 h-6 text-primary group-hover:animate-heartbeat" />
              </div>
              <h3 className="font-semibold text-lg mb-2">💡 Easy to Understand</h3>
              <p className="text-muted-foreground text-sm">Simple language and clear explanations for everyone</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
