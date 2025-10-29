# CAPTCHA Setup Guide

## Overview
The login page now includes Google reCAPTCHA v3 integration for enhanced security. This provides automatic bot detection without user interaction.

## What is reCAPTCHA v3?

reCAPTCHA v3 is Google's invisible CAPTCHA that:
- ✅ Works silently in the background
- ✅ Doesn't require user interaction
- ✅ Provides a risk score (0.0 to 1.0)
- ✅ Helps prevent fraud and abuse
- ✅ Returns a token for server-side verification

## Getting Your reCAPTCHA Keys

### Step 1: Go to Google reCAPTCHA Admin Console
1. Visit: https://www.google.com/recaptcha/admin/create
2. Sign in with your Google account (create one if needed)

### Step 2: Create a New Site
1. Click "Create" or "+" button
2. Enter the following details:

```
Label: SWASTH SATHI
reCAPTCHA type: reCAPTCHA v3
Domains: 
  - localhost:5173 (for development)
  - localhost:3000 (if using different dev port)
  - yourdomain.com (production domain)
  - www.yourdomain.com (if applicable)
```

### Step 3: Get Your Keys
After creating the site, you'll see:
- **Site Key** (public key) - Use in VITE_RECAPTCHA_SITE_KEY
- **Secret Key** (private key) - Use in backend verification (optional for now)

## Configuration

### Development Environment (.env.local)

Add the following to your `.env.local` file:

```bash
# Google reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

Example:
```bash
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

### Production Environment

Add the same variable to your hosting platform's environment variables:
- **Netlify**: Site settings → Build & deploy → Environment
- **Vercel**: Project settings → Environment Variables
- **AWS**: Parameter Store or Secrets Manager

## How It Works

### Frontend (Current Implementation)
1. User visits login page
2. User fills in email and password
3. User clicks "Sign In" or "Sign Up"
4. CAPTCHA verification runs silently in background
5. A token is generated and passed to Supabase auth
6. Authentication proceeds if CAPTCHA passes

### Backend Verification (Optional)

You can optionally verify the token on your backend:

```bash
curl -X POST https://www.google.com/recaptcha/api/siteverify \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'secret=YOUR_SECRET_KEY&response=TOKEN'
```

Response example:
```json
{
  "success": true,
  "score": 0.9,
  "action": "auth",
  "challenge_ts": "2025-10-30T12:34:56Z",
  "hostname": "swasthsathi.com"
}
```

**Score Interpretation:**
- 1.0 = Very likely legitimate
- 0.5 = Neutral
- 0.0 = Very likely bot

## Components & Usage

### CaptchaWrapper Component
Location: `src/components/CaptchaWrapper.tsx`

Provides:
- `CaptchaProvider` - Wraps app with Google reCAPTCHA context
- `useCaptcha` - Hook for manual verification (optional)

### Auth Page Integration
Location: `src/pages/Auth.tsx`

Features:
- Automatic CAPTCHA verification before login
- Visual indicator when CAPTCHA is verified
- Error handling and user feedback
- Secure button state management

## Features Implemented

✅ **Automatic Bot Detection**
- Runs when user submits login form
- No user interaction required
- Prevents automated attacks

✅ **Visual Feedback**
- Green badge shows "Security verified with CAPTCHA ✓"
- Button text changes to "Sign In Securely" after verification
- Clear security messages

✅ **Error Handling**
- Graceful fallback if CAPTCHA unavailable
- User-friendly error messages
- Validation before auth attempt

✅ **Environment Variable Support**
- Development key in code (demo key)
- Production key via environment variables
- Easy configuration per environment

## Testing

### Test with Demo Key
The component includes a demo reCAPTCHA key for testing:
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Shows "This site is using the SWASTH SATHI demo reCAPTCHA key"

### Test Locally
1. Ensure `.env.local` has `VITE_RECAPTCHA_SITE_KEY` set
2. Run: `npm run dev`
3. Visit `http://localhost:5173/auth`
4. Try logging in - CAPTCHA will verify automatically
5. Check browser console for CAPTCHA logs

## Troubleshooting

### "Captcha not ready" Error
- **Issue**: CAPTCHA service hasn't loaded yet
- **Solution**: Wait a moment and try again, or refresh page

### "CAPTCHA service is not available"
- **Issue**: Site Key not configured or incorrect
- **Solution**: Check `.env.local` for `VITE_RECAPTCHA_SITE_KEY`

### CAPTCHA Showing But Not Verifying
- **Issue**: Site Key doesn't match registered domain
- **Solution**: Add domain to reCAPTCHA console settings

### Demo Key Warnings
- **Issue**: Console shows demo key is being used
- **Solution**: Replace with production Site Key in `.env.local`

## Security Best Practices

⚠️ **Important:**
- Never expose `Secret Key` in frontend code
- Only use `Site Key` in browser
- Verify tokens on backend for critical operations
- Regenerate keys if exposed
- Keep reCAPTCHA console updated with all domains

## API Reference

### useCaptcha Hook

```typescript
const { verifyCaptcha } = useCaptcha();

// Verify CAPTCHA with custom action
const token = await verifyCaptcha('custom_action');
```

### CaptchaProvider Props

```typescript
<CaptchaProvider>
  {/* Your app */}
</CaptchaProvider>
```

## Files Modified/Created

```
src/
├── components/
│   └── CaptchaWrapper.tsx (NEW)
├── pages/
│   └── Auth.tsx (MODIFIED)
└── App.tsx (MODIFIED)
```

## Dependencies

```json
{
  "react-google-recaptcha-v3": "^3.10.0"
}
```

## Next Steps

1. ✅ Create Google reCAPTCHA account
2. ✅ Get Site Key and Secret Key
3. ✅ Add VITE_RECAPTCHA_SITE_KEY to .env.local
4. ✅ Test locally
5. ✅ Deploy to production
6. ✅ Update production environment variables

## Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [React Integration Library](https://github.com/seedalpha/react-google-recaptcha-v3)

## Support

For issues or questions about reCAPTCHA:
- Check [Google reCAPTCHA FAQ](https://developers.google.com/recaptcha/docs/faq)
- Review console logs for error details
- Verify domain configuration in reCAPTCHA console
