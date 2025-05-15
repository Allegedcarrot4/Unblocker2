import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Keyboard } from "lucide-react";

type UrlFormProps = {
  onSubmit: (url: string) => boolean;
  urlError: string;
  setUrlError: (error: string) => void;
};

export function UrlForm({ onSubmit, urlError, setUrlError }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showKeyboardTip, setShowKeyboardTip] = useState(false);

  // Set focus to input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Show keyboard tip after 2 seconds
    const timer = setTimeout(() => {
      setShowKeyboardTip(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Command+Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (url) {
          onSubmit(url);
        }
      }
      
      // Alt+P or Option+P to paste
      if ((e.altKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePaste();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with URL:", url);
    onSubmit(url);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setUrl(clipboardText);
    } catch (error) {
      setUrlError("Unable to access clipboard. Please paste manually.");
    }
  };

  return (
    <form className="space-y-4 mb-6 animate-fadeIn" onSubmit={handleSubmit}>
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <label
          htmlFor="url-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Website URL
        </label>
        <div className="mt-1 relative rounded-md shadow-sm transition-all-medium hover:shadow-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <Input
            ref={inputRef}
            type="text"
            id="url-input"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (urlError) setUrlError("");
            }}
            className="pl-10 pr-20 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 transition-all-medium"
            placeholder="google.com"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={handlePaste}
                    variant="outline"
                    className="h-7 mr-2 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 border-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-800/70 dark:border-blue-800 scale-hover"
                  >
                    Paste
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Alt+P to paste</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {showKeyboardTip && (
              <TooltipProvider>
                <Tooltip defaultOpen>
                  <TooltipTrigger asChild>
                    <div className="mr-2 text-blue-500 dark:text-blue-400 cursor-help animate-fadeIn">
                      <Keyboard className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Use Ctrl+Enter to submit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        {urlError && (
          <p className="mt-1 text-xs text-red-500 animate-slideUp">{urlError}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg animate-scaleIn"
        style={{ animationDelay: '0.2s' }}
      >
        <span className="flex items-center justify-center">
          <svg
            className="w-5 h-5 mr-2 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v3m0 0l-3-3m3 3l3-3m0-6v3m0 0l-3-3m3 3l3-3"
            ></path>
          </svg>
          Unblock Website
        </span>
      </Button>
    </form>
  );
}
