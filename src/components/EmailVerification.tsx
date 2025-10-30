import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Loader, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface EmailVerificationProps {
  email: string;
  onVerified: (email: string) => void;
  onCancel: () => void;
}

export const EmailVerification = ({
  email,
  onVerified,
  onCancel,
}: EmailVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulate sending verification code
  const handleSendCode = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to send verification email
      // In production, this would call your backend API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, log the code that would be sent
      const demoCode = Math.random().toString().substring(2, 8);
      console.log(`[DEMO] Verification code sent to ${email}: ${demoCode}`);

      setCodeSent(true);
      setTimeLeft(300); // 5 minutes

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            setCodeSent(false);
            setVerificationCode("");
            setError("Verification code expired. Please request a new one.");
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      // For demo: show a success message
      alert(
        `Verification code sent to ${email}\n\nFor demo purposes, use any 6-digit code.\nIn production, this would send a real email.`
      );
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to send verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate verification API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo: accept any 6-digit code
      if (/^\d{6}$/.test(verificationCode)) {
        setVerified(true);
        setTimeout(() => {
          onVerified(email);
        }, 1000);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-foreground">Email Verification</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          We'll send a verification code to <strong>{email}</strong> to confirm
          this is a real website.
        </p>

        {!codeSent && !verified && (
          <Button
            onClick={handleSendCode}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Verification Code
              </>
            )}
          </Button>
        )}

        {codeSent && !verified && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-foreground">
                  {timeLeft ? formatTime(timeLeft) : "Expired"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Code expires in</span>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                6-Digit Verification Code
              </label>
              <Input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, ""));
                  setError(null);
                }}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-widest font-bold"
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleVerifyCode}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            <Button
              onClick={handleSendCode}
              variant="ghost"
              disabled={loading}
              className="w-full text-xs"
            >
              Didn't receive code? Resend
            </Button>
          </div>
        )}

        {verified && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              Email verified! Proceeding...
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground border-t border-blue-200 dark:border-blue-800 pt-3 mt-3">
          ✓ This verification helps ensure you're connecting to a real SWASTH
          SATHI website
        </p>
      </div>
    </Card>
  );
};
