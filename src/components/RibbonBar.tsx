import { useState, useEffect } from "react";
import { Heart, AlertCircle, Syringe, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const RibbonBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navigationItems = [
    { id: "hero", label: "Home", icon: Heart },
    { id: "health-alerts", label: "Alerts", icon: AlertCircle },
    { id: "disease-info", label: "Diseases", icon: Syringe },
    { id: "vaccination", label: "Vaccination", icon: Syringe },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      {/* Main Ribbon Bar - Hidden on scroll, appears at top */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ease-out ${
          scrolled
            ? "opacity-0 pointer-events-none translate-y-[-10px]"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white py-3 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                <span className="text-sm font-semibold">✨ Quick Navigation</span>
              </div>
              <p className="text-xs text-white/80">
                Scroll to explore health information & wellness tips
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar - Appears on scroll */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ease-out backdrop-blur-md bg-background/80 border-b border-border/50 ${
          scrolled
            ? "opacity-100 translate-y-0 shadow-md"
            : "opacity-0 pointer-events-none translate-y-[-20px]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 whitespace-nowrap hover:bg-primary/10 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Button - Scroll back to top */}
      {scrolled && (
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="fixed bottom-20 right-6 z-40 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-110 active:scale-95 animate-float-in"
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default RibbonBar;
