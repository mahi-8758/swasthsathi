# Clear User Information from Database

## Overview
This document provides instructions for clearing user information from your Supabase database. User data is stored in three main tables:

1. **health_records** - User health information (age, gender, blood group, weight, etc.)
2. **chat_sessions** - User conversation sessions
3. **chat_messages** - Chat messages in those sessions

## Tables Containing User Data

### health_records
- Stores personal health information linked to auth.users
- Contains: age, gender, blood_group, height, weight, chronic_conditions, allergies, medications, surgeries, family_history, lifestyle_notes

### chat_sessions
- Tracks conversation sessions per user
- Linked to auth.users via user_id

### chat_messages
- Stores individual messages within sessions
- Linked to chat_sessions via session_id

## Methods to Clear User Data

### Method 1: Using Supabase Dashboard (Recommended for UI-based approach)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **swasthsathi** (ID: cpcinfhotflsiuwbjsjr)
3. Navigate to **SQL Editor**
4. Run the following SQL commands:

```sql
-- Delete all chat messages
DELETE FROM public.chat_messages;

-- Delete all chat sessions
DELETE FROM public.chat_sessions;

-- Delete all health records
DELETE FROM public.health_records;

-- Verify deletion
SELECT 'Health Records:' as table_name, COUNT(*) as count FROM public.health_records
UNION ALL
SELECT 'Chat Sessions:' as table_name, COUNT(*) as count FROM public.chat_sessions
UNION ALL
SELECT 'Chat Messages:' as table_name, COUNT(*) as count FROM public.chat_messages;
```

### Method 2: Using Supabase CLI

**Step 1: Install Supabase CLI** (if not already installed)
```bash
npm install -g supabase
# or
brew install supabase/tap/supabase  # on macOS
```

**Step 2: Login to Supabase**
```bash
supabase login
# Follow the authentication prompts
```

**Step 3: Link your project**
```bash
supabase link --project-ref cpcinfhotflsiuwbjsjr
```

**Step 4: Run the clear_user_data.sql script**
```bash
supabase db execute --file clear_user_data.sql
```

### Method 3: Direct Database Connection (Advanced)

If you have direct access to your Supabase database:

```bash
# Connect to Supabase database
psql "postgresql://postgres.[project-ref]:[password]@db.[region].supabase.co:5432/postgres"

# Run the SQL commands from clear_user_data.sql
```

## What Gets Deleted

✅ **Deleted:**
- All health records
- All chat sessions
- All chat messages

❌ **NOT Deleted (Preserved):**
- Auth users (requires special handling)
- Diseases table (reference data)
- Vaccinations table (reference data)
- Health alerts table (reference data)

## To Delete Auth Users

Auth users require admin privileges and should be deleted through:

1. **Supabase Dashboard:**
   - Go to Authentication → Users
   - Select users and click "Delete user"

2. **Using Supabase Management API:**
   ```bash
   curl -i -X DELETE 'https://[PROJECT-ID].supabase.co/auth/v1/admin/users/[USER-ID]' \
     -H 'Authorization: Bearer [SERVICE_ROLE_KEY]'
   ```

3. **Using Supabase CLI:**
   ```bash
   supabase auth delete [USER-ID]
   ```

## Verification

After clearing data, verify with this query:

```sql
SELECT 
  'health_records' as table_name, COUNT(*) as count FROM public.health_records
UNION ALL
SELECT 'chat_sessions', COUNT(*) FROM public.chat_sessions
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM public.chat_messages;
```

All counts should return **0**.

## Database Connection Details

- **Project ID:** cpcinfhotflsiuwbjsjr
- **Project URL:** https://cpcinfhotflsiuwbjsjr.supabase.co
- **Database:** postgres
- **Region:** (check in Supabase dashboard)

## Safety Notes

⚠️ **Important:**
- This operation is **permanent** and cannot be undone
- Always back up important data before clearing
- The reference data (diseases, vaccinations, alerts) is preserved
- Only user-specific data is removed

## Support

For any issues or questions, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
