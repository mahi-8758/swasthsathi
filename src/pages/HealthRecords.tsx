import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileHeart, ArrowLeft, Lock, Check } from "lucide-react";
import PasswordSecurity from "@/components/PasswordSecurity";
import GoogleTranslateWidget from "@/components/GoogleTranslateWidget";
import type { User } from "@supabase/supabase-js";

interface HealthRecord {
  id?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  height?: number;
  weight?: number;
  chronic_conditions?: string;
  allergies?: string;
  current_medications?: string;
  previous_surgeries?: string;
  family_history?: string;
  lifestyle_notes?: string;
}

const HealthRecords = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [record, setRecord] = useState<HealthRecord>({});
  const [showPasswordSecurity, setShowPasswordSecurity] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchHealthRecords(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchHealthRecords = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("health_records")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setRecord(data);
        setLastSaved(new Date());
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Auto-save with debounce
  useEffect(() => {
    // Skip auto-save on initial load
    if (isInitialLoad || !user || !record.id) return;

    const autoSaveTimer = setTimeout(async () => {
      await performAutoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [record]);

  const performAutoSave = async () => {
    if (!user || !record.id) return;

    setAutoSaving(true);
    try {
      const recordData = {
        user_id: user.id,
        age: record.age || null,
        gender: record.gender || null,
        blood_group: record.blood_group || null,
        height: record.height || null,
        weight: record.weight || null,
        chronic_conditions: record.chronic_conditions || null,
        allergies: record.allergies || null,
        current_medications: record.current_medications || null,
        previous_surgeries: record.previous_surgeries || null,
        family_history: record.family_history || null,
        lifestyle_notes: record.lifestyle_notes || null,
      };

      const { error } = await supabase
        .from("health_records")
        .update(recordData)
        .eq("id", record.id);

      if (error) throw error;
      setLastSaved(new Date());
    } catch (error: any) {
      console.error("Auto-save failed:", error);
    } finally {
      setAutoSaving(false);
    }
  };

  const performInitialSave = async () => {
    if (!user || record.id) return;

    setSaving(true);
    try {
      const recordData = {
        user_id: user.id,
        age: record.age || null,
        gender: record.gender || null,
        blood_group: record.blood_group || null,
        height: record.height || null,
        weight: record.weight || null,
        chronic_conditions: record.chronic_conditions || null,
        allergies: record.allergies || null,
        current_medications: record.current_medications || null,
        previous_surgeries: record.previous_surgeries || null,
        family_history: record.family_history || null,
        lifestyle_notes: record.lifestyle_notes || null,
      };

      const { data, error } = await supabase
        .from("health_records")
        .insert([recordData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setRecord(data[0]);
        setLastSaved(new Date());
        toast({
          title: "Success!",
          description: "Your health records have been saved. Future changes will auto-save.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showPasswordSecurity) {
    return (
      <PasswordSecurity
        userEmail={user?.email}
        onBack={() => setShowPasswordSecurity(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-8 px-4">
      <div className="absolute top-4 right-4">
        <GoogleTranslateWidget />
      </div>
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <FileHeart className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Health Records</h1>
              <p className="text-muted-foreground">
                Your personal health information helps our AI provide better recommendations
              </p>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={record.age || ""}
                  onChange={(e) => setRecord({ ...record, age: parseInt(e.target.value) || undefined })}
                  placeholder="25"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={record.gender || ""}
                  onChange={(e) => setRecord({ ...record, gender: e.target.value })}
                  placeholder="Male/Female/Other"
                />
              </div>

              <div>
                <Label htmlFor="blood_group">Blood Group</Label>
                <Input
                  id="blood_group"
                  value={record.blood_group || ""}
                  onChange={(e) => setRecord({ ...record, blood_group: e.target.value })}
                  placeholder="A+, B+, O+, AB+, etc."
                />
              </div>

              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={record.height || ""}
                  onChange={(e) => setRecord({ ...record, height: parseFloat(e.target.value) || undefined })}
                  placeholder="170"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={record.weight || ""}
                  onChange={(e) => setRecord({ ...record, weight: parseFloat(e.target.value) || undefined })}
                  placeholder="70"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
              <Textarea
                id="chronic_conditions"
                value={record.chronic_conditions || ""}
                onChange={(e) => setRecord({ ...record, chronic_conditions: e.target.value })}
                placeholder="Diabetes, Hypertension, Asthma, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={record.allergies || ""}
                onChange={(e) => setRecord({ ...record, allergies: e.target.value })}
                placeholder="Penicillin, Pollen, Nuts, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="current_medications">Current Medications</Label>
              <Textarea
                id="current_medications"
                value={record.current_medications || ""}
                onChange={(e) => setRecord({ ...record, current_medications: e.target.value })}
                placeholder="List all medications you're currently taking"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="previous_surgeries">Previous Surgeries</Label>
              <Textarea
                id="previous_surgeries"
                value={record.previous_surgeries || ""}
                onChange={(e) => setRecord({ ...record, previous_surgeries: e.target.value })}
                placeholder="Any surgeries or major procedures"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="family_history">Family Medical History</Label>
              <Textarea
                id="family_history"
                value={record.family_history || ""}
                onChange={(e) => setRecord({ ...record, family_history: e.target.value })}
                placeholder="Hereditary conditions in your family"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="lifestyle_notes">Lifestyle & Habits</Label>
              <Textarea
                id="lifestyle_notes"
                value={record.lifestyle_notes || ""}
                onChange={(e) => setRecord({ ...record, lifestyle_notes: e.target.value })}
                placeholder="Exercise routine, diet, smoking, alcohol consumption, etc."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              {!record.id ? (
                <Button
                  type="button"
                  disabled={saving}
                  onClick={performInitialSave}
                  className="flex-1 bg-secondary hover:bg-secondary/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Health Records"
                  )}
                </Button>
              ) : (
                <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Records Saved ✓
                    </p>
                    {lastSaved && (
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Last saved: {lastSaved.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  {autoSaving && (
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  )}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordSecurity(true)}
                className="flex-1"
              >
                <Lock className="w-4 h-4 mr-2" />
                Password & Security
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              🔒 Your health records are securely stored and only visible to you. The AI chatbot uses this information to provide personalized health recommendations.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HealthRecords;
