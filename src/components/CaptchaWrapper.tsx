import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { ReactNode } from 'react';

// Get reCAPTCHA key from environment
const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Demo key

export const CaptchaProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}>
      {children}
    </GoogleReCaptchaProvider>
  );
};

export const useCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const verifyCaptcha = async (action: string = 'submit') => {
    if (!executeRecaptcha) {
      console.log('Captcha not ready');
      return null;
    }

    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch (error) {
      console.error('Captcha verification failed:', error);
      return null;
    }
  };

  return { verifyCaptcha };
};
