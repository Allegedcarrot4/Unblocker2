import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AuthBadge() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('unblocker_authenticated');
    setIsAuthenticated(authStatus === 'true');

    // Add event listener to track changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'unblocker_authenticated') {
        setIsAuthenticated(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle logout/reset
  const handleReset = () => {
    if (confirm('Are you sure you want to reset authentication? You will need to enter the password again.')) {
      localStorage.removeItem('unblocker_authenticated');
      setIsAuthenticated(false);
      // Reload to trigger password prompt
      window.location.reload();
    }
  };

  if (!isAuthenticated) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleReset}
            className="flex items-center px-2 py-1 text-[10px] sm:text-xs rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 cursor-pointer transition-all-medium hover:bg-green-200 dark:hover:bg-green-800/50 animate-fadeIn"
          >
            <ShieldCheck className="h-3 w-3 mr-0.5 sm:mr-1 animate-pulse" />
            <span className="hidden xs:inline">Protected</span>
            <span className="xs:hidden">✓</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>You're using a password-protected session. Click to reset.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}