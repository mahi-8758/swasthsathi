# 📧 Resend Email Integration Setup Guide

This guide will help you set up the Resend email service for the Contact Us feature in SWASTH SATHI.

## 🚀 What Changed?

The Contact Us feature now uses **Resend API** instead of Web3Forms for sending emails. This provides:
- ✅ Better email deliverability
- ✅ Professional email templates
- ✅ Automatic confirmation emails to users
- ✅ Admin notifications to kumarmahi8758@gmail.com
- ✅ Secure API key handling

## 📋 Setup Instructions

### Step 1: Create Resend Account
1. Visit [Resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get Your API Key
1. Go to [Resend Dashboard](https://dashboard.resend.com)
2. Navigate to **API Keys** section
3. Create a new API key (or copy existing one)
4. Copy the API key (starts with `re_`)

### Step 3: Add API Key to Environment Variables

#### For Local Development
Update `.env.local`:
```env
VITE_SUPABASE_URL=https://cpcinfhotflsiuwbjsjr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwY2luZmhvdGZsc2l1d2Jqc2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MDk3NDcsImV4cCI6MjA0NTI4NTc0N30.E-Qm_qCn_9mHFCKGiLlpLd5oNVcl5pL3lL9wQ8-JMEU
VITE_RESEND_API_KEY=re_your_actual_api_key_here
```

#### For Supabase Edge Function (Production)
1. Go to your Supabase project
2. Navigate to **Settings → Secrets**
3. Create a new secret:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key (e.g., `re_...`)

### Step 4: Update Netlify Environment Variables
1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site Settings → Build & Deploy → Environment**
4. Add a new environment variable:
   - Key: `VITE_RESEND_API_KEY`
   - Value: Your Resend API key

### Step 5: Deploy Supabase Function
The function is already created at: `supabase/functions/contact-email/index.ts`

To deploy:
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Deploy the function
supabase functions deploy contact-email
```

## 🔍 How It Works

1. **User submits contact form** → Validation checks on client side
2. **Frontend calls Supabase Edge Function** → `contact-email` endpoint
3. **Function receives data** → Calls Resend API
4. **Two emails are sent:**
   - **Admin email** to kumarmahi8758@gmail.com with full details
   - **Confirmation email** to user confirming message received
5. **User sees success toast** with confirmation message

## 📧 Email Templates

### Admin Email (kumarmahi8758@gmail.com)
- Contains: Name, Email, Subject, Full Message
- Professional formatting
- Reply-to field set to user's email

### User Confirmation Email
- Professional thank you message
- Echo of their message
- Assurance of response

## ✅ Testing

### Local Testing
```bash
npm run dev
# Visit contact form at http://localhost:8080
# Fill form and submit
# Check console for any errors
```

### Production Testing
1. Deploy to Netlify: `git push origin master`
2. Wait for build to complete
3. Test on live URL: https://swasthsathi-io.netlify.app/
4. Check email delivery at kumarmahi8758@gmail.com

## 🐛 Troubleshooting

### Emails not sending?
- ✅ Verify Resend API key is correct
- ✅ Check email address in form is valid
- ✅ Ensure Supabase edge function is deployed
- ✅ Check browser console for errors

### Function deployment failed?
```bash
# Check function status
supabase functions list

# View logs
supabase functions fetch contact-email --logs

# Redeploy
supabase functions deploy contact-email
```

### API Key issues?
- ✅ API key should start with `re_`
- ✅ Copy entire key without spaces
- ✅ Regenerate new key if uncertain

## 📞 Free Tier Limits

Resend free tier includes:
- ✅ 100 emails/day
- ✅ Up to 10,000 emails/month
- ✅ All features included
- ✅ No credit card required initially

## 🔐 Security Notes

- 🔒 API keys are stored securely in environment variables
- 🔒 Never commit `.env.local` to git (already in .gitignore)
- 🔒 Use Supabase secrets for production
- 🔒 Emails contain user data but are handled securely

## 📝 Resend Documentation

For more information, visit:
- [Resend Docs](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Templates](https://resend.com/docs/templates)

## ✨ Next Steps

1. ✅ Create Resend account
2. ✅ Add API key to `.env.local`
3. ✅ Test locally: `npm run dev`
4. ✅ Deploy to Supabase: `supabase functions deploy contact-email`
5. ✅ Add API key to Netlify environment variables
6. ✅ Push to master: `git push origin master`
7. ✅ Test on production

---

**Questions?** Check the code comments in:
- `src/components/ContactUs.tsx` - Frontend component
- `supabase/functions/contact-email/index.ts` - Backend function

**Status**: ✅ Ready for configuration
