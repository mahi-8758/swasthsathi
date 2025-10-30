import { useEffect } from 'react';

interface Window {
  google?: {
    translate?: {
      TranslateElement?: new (options: { pageLanguage: string; includedLanguages: string; layout: number; autoDisplay: boolean }, elementId: string) => void;
    };
  };
}

declare let window: Window;

export const GoogleTranslate = () => {
  useEffect(() => {
    // Add Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,zh-CN,hi,pt,ja',
            layout: 0, // 0 = SIMPLE, 1 = VERTICAL, 2 = HORIZONTAL
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    return () => {
      // Clean up
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div id="google_translate_element" className="hidden"></div>
  );
};

export default GoogleTranslate;
