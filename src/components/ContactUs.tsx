import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Globe } from "lucide-react";

const ContactUs = () => {

  return (
    <section id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="p-3 rounded-full bg-primary/10 shadow-lg">
              <Mail className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Get in Touch 💬
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or suggestions? We'd love to hear from you! 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6 animate-fade-in animation-delay-1000">
            {/* Email Card */}
            <Card className="p-6 bg-card/50 backdrop-blur-md border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Email</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Send us an email anytime with your questions or feedback.
              </p>
              <a
                href="mailto:kumarmahi8758@gmail.com"
                className="text-primary font-medium hover:underline mt-3 inline-block transition-colors"
              >
                kumarmahi8758@gmail.com
              </a>
            </Card>

            {/* Location Card */}
            <Card className="p-6 bg-card/50 backdrop-blur-md border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg">Location</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Based in India, serving communities across the globe with health awareness.
              </p>
              <p className="text-primary font-medium mt-3">🇮🇳 India</p>
            </Card>

            {/* Project Info Card */}
            <Card className="p-6 bg-card/50 backdrop-blur-md border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">About Project</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                SWASTH SATHI - AI-powered health awareness platform for everyone.
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">
                  <strong>Creator:</strong> Mahi
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Repository:</strong>{" "}
                  <a
                    href="https://github.com/mahi-8758/swasthsathi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub
                  </a>
                </p>
              </div>
            </Card>
          </div>


        </div>

        {/* Bottom Call-to-Action */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 animate-fade-in animation-delay-3000">
          <h3 className="text-2xl font-bold mb-3">Have a Question?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Whether you have feedback, feature requests, or just want to chat about health awareness, 
            we're here to listen. Reach out directly through email or GitHub!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90"
            >
              <a href="mailto:kumarmahi8758@gmail.com">
                📧 Send Email
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="hover:bg-secondary/10"
            >
              <a href="https://github.com/mahi-8758/swasthsathi" target="_blank" rel="noopener noreferrer">
                🔗 GitHub Repository
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
