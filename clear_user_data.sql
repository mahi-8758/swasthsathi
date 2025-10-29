-- Clear User Information from Database
-- This script removes all user-related data while keeping the system data intact

-- Delete all chat messages (will cascade)
DELETE FROM public.chat_messages;

-- Delete all chat sessions (will cascade to chat_messages if not already deleted)
DELETE FROM public.chat_sessions;

-- Delete all health records (linked to users)
DELETE FROM public.health_records;

-- Note: Supabase auth.users table requires special handling
-- To delete auth users, use the Supabase dashboard or API
-- This requires admin privileges and cannot be done via standard SQL

-- Verify deletions
SELECT 'Health Records Count:' as check_name, COUNT(*) as count FROM public.health_records
UNION ALL
SELECT 'Chat Sessions Count:' as check_name, COUNT(*) as count FROM public.chat_sessions
UNION ALL
SELECT 'Chat Messages Count:' as check_name, COUNT(*) as count FROM public.chat_messages;
