import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export const GoogleTranslateWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Load Google Translate script only once
    if (scriptLoaded.current) return;

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.type = 'text/javascript';

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,zh-CN,hi,pt,ja',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      } catch (error) {
        console.log('Google Translate initialized');
      }
    };

    document.head.appendChild(script);
    scriptLoaded.current = true;

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
        scriptLoaded.current = false;
      }
    };
  }, []);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh-CN', name: '中文 (简体)' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
  ];

  const handleTranslate = (code: string) => {
    const element = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (element) {
      element.value = code;
      element.dispatchEvent(new Event('change'));
    }
  };

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            title="Translate page"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Translate</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" ref={containerRef}>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleTranslate(lang.code)}
              className="cursor-pointer"
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default GoogleTranslateWidget;
