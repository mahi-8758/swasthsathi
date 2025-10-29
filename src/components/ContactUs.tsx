import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2, MapPin, Phone, Globe } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.subject.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a subject",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your message",
        variant: "destructive",
      });
      return false;
    }

    if (formData.message.trim().length < 10) {
      toast({
        title: "Validation Error",
        description: "Message must be at least 10 characters long",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Send email using Web3Forms (free email service)
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "4f142e97-3eb9-4a60-a96d-3a4da3a0d7a1", // Web3Forms free key
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: "SWASTH SATHI Contact Form",
          to_email: "kumarmahi8758@gmail.com", // Default recipient email
          redirect: window.location.href,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        toast({
          title: "Success! 📧",
          description: "Your message has been sent to the creator. We'll get back to you soon!",
        });

        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

          {/* Contact Form */}
          <div className="lg:col-span-2 animate-fade-in animation-delay-2000">
            <Card className="p-8 bg-card/50 backdrop-blur-md border border-primary/20 shadow-xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto animate-pulse">
                    <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Message Sent! 🎉
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Thank you for reaching out! We've received your message and will get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      disabled={loading}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      disabled={loading}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is your message about?"
                      disabled={loading}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us what's on your mind... (minimum 10 characters)"
                      rows={5}
                      disabled={loading}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {/* Helper Text */}
                  <p className="text-xs text-center text-muted-foreground">
                    ✨ We typically respond within 24-48 hours
                  </p>
                </form>
              )}
            </Card>
          </div>
        </div>

        {/* Bottom Call-to-Action */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 animate-fade-in animation-delay-3000">
          <h3 className="text-2xl font-bold mb-3">Have a Question?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Whether you have feedback, feature requests, or just want to chat about health awareness, 
            we're here to listen. Fill out the form above or reach out directly!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:bg-primary/10"
            >
              📧 Contact Form
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
