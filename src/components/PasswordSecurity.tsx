import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, KeyRound, ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface PasswordSecurityProps {
  userEmail?: string;
  onBack: () => void;
}

const PasswordSecurity = ({ userEmail, onBack }: PasswordSecurityProps) => {
  const [tab, setTab] = useState<"change" | "forgot">("change");
  const [loading, setLoading] = useState(false);
  
  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState(userEmail || "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  
  const { toast } = useToast();

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your password has been changed successfully.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  // Send OTP Handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "Email Sent!",
        description: "Check your email for the password reset link",
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

  // Reset Password with OTP Handler
  const handleResetPasswordWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetPassword !== confirmResetPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (resetPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For Supabase, the reset link sent via email contains the token
      // The OTP field here is optional - Supabase uses email link verification
      const { error } = await supabase.auth.updateUser({
        password: resetPassword,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your password has been reset successfully.",
      });

      setOtpSent(false);
      setOtp("");
      setResetPassword("");
      setConfirmResetPassword("");
      setForgotEmail("");
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Health Records
        </Button>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">🔐 Password & Security</h1>
              <p className="text-muted-foreground">
                Manage your login credentials and account security
              </p>
            </div>
          </div>

          <Tabs value={tab} onValueChange={(value: any) => setTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="change" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Change Password
              </TabsTrigger>
              <TabsTrigger value="forgot" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Forgot Password
              </TabsTrigger>
            </TabsList>

            {/* Change Password Tab */}
            <TabsContent value="change" className="space-y-6 mt-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ℹ️ You're logged in as: <strong>{userEmail}</strong>
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password (min. 6 characters)"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ <strong>Security Tip:</strong> Choose a strong password with a mix of uppercase, lowercase, numbers, and special characters.
                </p>
              </div>
            </TabsContent>

            {/* Forgot Password Tab */}
            <TabsContent value="forgot" className="space-y-6 mt-6">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <Label htmlFor="forgot_email">Email Address</Label>
                    <Input
                      id="forgot_email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary hover:bg-secondary/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      ℹ️ We'll send a password reset link to your email. Click the link to verify and set a new password.
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordWithOtp} className="space-y-6">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✅ Reset link sent to <strong>{forgotEmail}</strong>. Check your email for the verification link.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="verification_code">Verification Code (Optional)</Label>
                    <InputOTP value={otp} onChange={setOtp} maxLength={6}>
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

                  <div>
                    <Label htmlFor="reset_password">New Password</Label>
                    <Input
                      id="reset_password"
                      type="password"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder="Enter your new password (min. 6 characters)"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm_reset_password">Confirm New Password</Label>
                    <Input
                      id="confirm_reset_password"
                      type="password"
                      value={confirmResetPassword}
                      onChange={(e) => setConfirmResetPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                        setResetPassword("");
                        setConfirmResetPassword("");
                      }}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-secondary hover:bg-secondary/90"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      💡 <strong>Didn't receive the email?</strong> Check your spam folder or click "Back" to resend the link.
                    </p>
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

export default PasswordSecurity;
