-- Create diseases table for information about diseases
CREATE TABLE IF NOT EXISTS public.diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  prevention TEXT NOT NULL,
  treatment TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vaccinations table for vaccination schedule information
CREATE TABLE IF NOT EXISTS public.vaccinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  schedule TEXT NOT NULL,
  description TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health alerts table for outbreak alerts
CREATE TABLE IF NOT EXISTS public.health_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'urgent', 'critical')),
  location TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table for storing chat history (public, no auth required)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required)
CREATE POLICY "Anyone can view diseases" ON public.diseases FOR SELECT USING (true);
CREATE POLICY "Anyone can view vaccinations" ON public.vaccinations FOR SELECT USING (true);
CREATE POLICY "Anyone can view active health alerts" ON public.health_alerts FOR SELECT USING (active = true);
CREATE POLICY "Anyone can view their chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON public.diseases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vaccinations_updated_at BEFORE UPDATE ON public.vaccinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_alerts_updated_at BEFORE UPDATE ON public.health_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample disease data
INSERT INTO public.diseases (name, symptoms, prevention, treatment, severity, category) VALUES
('Malaria', 'Fever, chills, headache, sweating, fatigue, nausea, vomiting', 'Use mosquito nets, apply insect repellent, take antimalarial medication if recommended', 'Antimalarial medications as prescribed by doctor', 'high', 'Infectious'),
('Tuberculosis (TB)', 'Persistent cough lasting 3+ weeks, chest pain, coughing up blood, fatigue, fever, night sweats, weight loss', 'BCG vaccination, avoid close contact with TB patients, maintain good ventilation', 'Complete course of antibiotics (6-9 months), directly observed therapy', 'high', 'Infectious'),
('Dengue Fever', 'High fever, severe headache, pain behind eyes, joint and muscle pain, rash, mild bleeding', 'Eliminate mosquito breeding sites, use mosquito repellent, wear protective clothing', 'Rest, fluids, pain relievers (avoid aspirin), monitor for warning signs', 'medium', 'Infectious'),
('Cholera', 'Severe watery diarrhea, vomiting, rapid dehydration, muscle cramps', 'Drink safe water, practice good hygiene, eat properly cooked food, oral cholera vaccine', 'Oral rehydration solution, intravenous fluids in severe cases, antibiotics', 'high', 'Infectious'),
('COVID-19', 'Fever, cough, fatigue, loss of taste or smell, difficulty breathing, body aches', 'Vaccination, wear masks, maintain social distance, wash hands frequently, ventilation', 'Rest, fluids, fever reducers, medical care for severe symptoms, antiviral medications if prescribed', 'medium', 'Infectious');

-- Insert sample vaccination data
INSERT INTO public.vaccinations (name, age_group, schedule, description, required) VALUES
('BCG (Tuberculosis)', 'Birth', 'Single dose at birth or as soon as possible', 'Protects against severe forms of tuberculosis', true),
('Hepatitis B', 'Birth to 18 months', 'Birth, 1-2 months, 6-18 months', 'Protects against hepatitis B virus infection', true),
('DPT (Diphtheria, Pertussis, Tetanus)', '6 weeks to 18 months', '6 weeks, 10 weeks, 14 weeks, booster at 16-24 months', 'Protects against diphtheria, pertussis (whooping cough), and tetanus', true),
('Polio (OPV/IPV)', '6 weeks to 18 months', '6 weeks, 10 weeks, 14 weeks, booster at 16-24 months', 'Protects against poliomyelitis', true),
('Measles, Mumps, Rubella (MMR)', '9 months to 15 years', '9-12 months, booster at 4-6 years', 'Protects against measles, mumps, and rubella', true),
('COVID-19', '12 years and above', 'Two doses 4-12 weeks apart, boosters as recommended', 'Protects against COVID-19 infection and severe disease', true),
('Typhoid', '2 years and above', 'Single dose, booster every 3 years', 'Protects against typhoid fever', false),
('Hepatitis A', '1 year and above', 'Two doses 6-12 months apart', 'Protects against hepatitis A virus', false);

-- Insert sample health alerts
INSERT INTO public.health_alerts (title, description, severity, location, active) VALUES
('Seasonal Flu Vaccination Drive', 'Free flu vaccination available at all government health centers. Recommended for children, elderly, and people with chronic conditions.', 'info', 'All Districts', true),
('Dengue Outbreak Alert', 'Increased dengue cases reported in urban areas. Eliminate standing water, use mosquito repellent, and seek immediate medical care if symptoms appear.', 'warning', 'Urban Areas', true),
('Clean Water Initiative', 'Boil water before drinking. Water purification tablets available at health centers. Check water quality in your area.', 'info', 'Rural Areas', true);