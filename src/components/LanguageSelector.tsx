import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe } from '@phosphor-icons/react';
import { useLocalization } from '../hooks/useLocalization';

/**
 * Language Selector Component
 * Professional language switcher for SmartRail-AI
 */
export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useLocalization();

  const languageLabels = {
    de: '🇩🇪 Deutsch',
    en: '🇺🇸 English', 
    fr: '🇫🇷 Français'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe size={16} />
          <span className="hidden sm:inline">
            {languageLabels[currentLanguage]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={currentLanguage === lang ? 'bg-primary/10' : ''}
          >
            {languageLabels[lang as keyof typeof languageLabels]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
