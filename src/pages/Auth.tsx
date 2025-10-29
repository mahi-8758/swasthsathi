import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Mail, Lock, Shield, Smartphone, KeyRound, ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Auth = () => {
  const [authMode, setAuthMode] = useState<"password" | "magic" | "phone">("password");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully signed in." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast({ 
          title: "Account created!", 
          description: "You can now sign in with your credentials." 
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;

      setMagicLinkSent(true);
      toast({
        title: "Magic Link Sent!",
        description: "Check your email and click the link to sign in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      setPhoneOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: "Check your phone for the 6-digit verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You're now signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Invalid OTP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="w-full p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
          <p className="text-muted-foreground mt-2">
            Secure access to your health portal
          </p>
        </div>

        <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "password" | "magic" | "phone")} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="password" className="flex items-center gap-1 text-xs sm:text-sm">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Password</span>
            </TabsTrigger>
            <TabsTrigger value="magic" className="flex items-center gap-1 text-xs sm:text-sm">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email Link</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-1 text-xs sm:text-sm">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Phone OTP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <form onSubmit={handlePasswordAuth} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary/90"
              >
                {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-secondary hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="magic">
            {!magicLinkSent ? (
              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div className="p-4 bg-secondary/10 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    🔗 No password needed! We'll send a secure sign-in link to your email
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-secondary/90"
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-secondary/10 rounded-lg text-center space-y-3">
                  <div className="text-4xl">✉️</div>
                  <p className="text-sm font-medium text-foreground">
                    Check your email!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We sent a sign-in link to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click the link in the email to sign in instantly (no code needed)
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={handleSendMagicLink}
                    disabled={loading}
                    className="text-sm text-secondary hover:underline"
                  >
                    Didn't receive? Resend link
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => {
                      setMagicLinkSent(false);
                      setEmail("");
                    }}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Change email
                  </button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="phone">
            {!phoneOtpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div className="p-4 bg-secondary/10 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    📱 We'll send a 6-digit code to your phone number
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include country code (e.g., +1 for US)
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-secondary/90"
                >
                  {loading ? "Sending..." : "Send OTP Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                <div className="p-4 bg-secondary/10 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    📲 Enter the 6-digit code sent to <strong>{phone}</strong>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
                    <KeyRound className="w-4 h-4" />
                    Enter OTP Code
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-secondary hover:bg-secondary/90"
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={loading}
                    className="text-sm text-secondary hover:underline"
                  >
                    Didn't receive? Resend code
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneOtpSent(false);
                      setOtp("");
                    }}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Change phone number
                  </button>
                </div>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </Card>
      </div>
    </div>
  );
};

export default Auth;
