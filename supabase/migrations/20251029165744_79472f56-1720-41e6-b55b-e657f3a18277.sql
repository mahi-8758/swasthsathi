-- Create chat_sessions table to track conversation ownership
CREATE TABLE public.chat_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.chat_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own sessions
CREATE POLICY "Users can create their own sessions"
ON public.chat_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Drop existing permissive policies on chat_messages
DROP POLICY IF EXISTS "Anyone can view their chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can create chat messages" ON public.chat_messages;

-- Create secure RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
ON public.chat_messages
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND session_id IN (
    SELECT id FROM public.chat_sessions WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND session_id IN (
    SELECT id FROM public.chat_sessions WHERE user_id = auth.uid()
  )
);

-- Add trigger for updating chat_sessions timestamp
CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();