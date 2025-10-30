import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Leaf, Mail, Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import GoogleTranslateWidget from "@/components/GoogleTranslateWidget";
import { EmailVerification } from "@/components/EmailVerification";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();

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

  const handleCaptchaVerification = async () => {
    if (!executeRecaptcha) {
      toast({
        title: "CAPTCHA Error",
        description: "CAPTCHA service is not available",
        variant: "destructive",
      });
      return false;
    }

    try {
      const token = await executeRecaptcha("auth");
      setCaptchaToken(token);
      setCaptchaVerified(true);
      return true;
    } catch (error) {
      toast({
        title: "CAPTCHA Verification Failed",
        description: "Please try again",
        variant: "destructive",
      });
      setCaptchaVerified(false);
      return false;
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check email verification first
    if (!emailVerified) {
      setShowEmailVerification(true);
      return;
    }
    
    // Verify CAPTCHA second
    if (!captchaVerified) {
      const isCaptchaValid = await handleCaptchaVerification();
      if (!isCaptchaValid) {
        return;
      }
    }

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-primary/10 p-4">
      <div className="absolute top-4 right-4">
        <GoogleTranslateWidget />
      </div>
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

          {showEmailVerification && email && (
            <div className="mb-6">
              <EmailVerification
                email={email}
                onVerified={(verifiedEmail) => {
                  setEmailVerified(true);
                  setShowEmailVerification(false);
                  toast({
                    title: "Email Verified",
                    description: `${verifiedEmail} has been verified.`,
                  });
                }}
                onCancel={() => {
                  setShowEmailVerification(false);
                  setEmailVerified(false);
                  setEmail("");
                }}
              />
            </div>
          )}

          {emailVerified && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                Email verified ✓
              </span>
            </div>
          )}

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
              disabled={loading || !emailVerified}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              {loading
                ? "Loading..."
                : !emailVerified
                ? "Verify Email First"
                : captchaVerified
                ? isLogin
                  ? "Sign In Securely"
                  : "Sign Up Securely"
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </Button>

            {emailVerified && !captchaVerified && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                🔒 Your login will be secured with reCAPTCHA verification
              </p>
            )}

            {!emailVerified && (
              <p className="text-xs text-center text-amber-600 dark:text-amber-400 mt-2">
                ⚠️ Please verify your email to continue
              </p>
            )}

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
        </Card>
      </div>
    </div>
  );
};

export default Auth;
