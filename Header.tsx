import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GamesTab } from '@/components/GamesTab';
import { AlertCircle } from 'lucide-react';
import { AuthBadge } from '@/components/AuthBadge';

type HeaderProps = {};

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 shadow-md py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center w-full justify-between sm:justify-start">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Web Unblocker</h1>
          </div>
          <nav className="ml-6 flex space-x-2 sm:hidden">
            <GamesTab onSelectGame={() => {}} />
          </nav>
        </div>
        
        {/* Middle section for mobile only - will be at top on sm screens */}
        <div className="hidden sm:flex items-center mt-0 ml-6 space-x-2">
          <GamesTab onSelectGame={() => {}} />
        </div>
        
        {/* Controls section */}
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
          <AuthBadge />
          <div className="text-[10px] sm:text-xs text-white/80 flex items-center">
            <AlertCircle className="h-3 w-3 mr-0.5 sm:mr-1" />
            <span className="hidden xs:inline">Won't work with reCAPTCHA sites</span>
            <span className="xs:hidden">No reCAPTCHA</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}