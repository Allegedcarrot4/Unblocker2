import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Gamepad2 } from 'lucide-react';

type Game = {
  name: string;
  url: string;
};

type GamesTabProps = {
  onSelectGame: (url: string) => void;
};

export function GamesTab({ onSelectGame }: GamesTabProps) {
  const [isOpen, setIsOpen] = useState(false);

  const games: Game[] = [
    { name: "Yohoho.io", url: "https://yohoho.io/" },
    { name: "1v1.LOL", url: "https://1v1.lol/" },
    { name: "Stabfish.io", url: "https://stabfish2.io/" },
    { name: "Poki.com", url: "https://poki.com/" },
    { name: "Granny", url: "https://www.gamepix.com/play/creapy-granny-scream" },
  ];

  // This function opens a game in a new window using the about:blank technique
  const handleGameSelect = (url: string) => {
    // Create new popup window with about:blank
    const newWindow = window.open("", "_blank");
    
    if (!newWindow) {
      alert("Popup blocked! Please allow popups for this website to play games.");
      return;
    }
    
    // For yohoho.io and other games, create a custom HTML page with an iframe
    const gameTitle = url.includes("yohoho") ? "Yohoho.io" : 
                      url.includes("1v1") ? "1v1.LOL" : 
                      url.includes("stabfish") ? "Stabfish.io" : 
                      url.includes("poki") ? "Poki.com" :
                      url.includes("creapy-granny-scream") ? "Granny" : "Game";
    
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${gameTitle}</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background-color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          .loading-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 100;
          }
          .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #3b82f6;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px auto;
          }
          .loading-text {
            font-size: 18px;
            color: #2563eb;
            font-weight: bold;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            background-color: #1e40af;
            color: white;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease-in-out;
          }
          .header-title {
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
          }
          .header-title svg {
            margin-right: 8px;
          }
          .btn-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
          }
          .game-container {
            position: absolute;
            top: 40px;
            left: 0;
            right: 0;
            bottom: 0;
            transition: all 0.3s ease-in-out;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 16H9l-1.5 3h-3L3 16c0-2.5 2.5-5 6.5-5 1 0 2 .15 2.9.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.9 15 21 19l-2.5 2-3.5-2-3.5 2-2.5-2 1.1-4c.3-1.2 1.4-2 2.6-2h2.6c1.2 0 2.3.8 2.6 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${gameTitle}
          </div>
          <button class="btn-close" onclick="hideHeader()">×</button>
        </div>
        
        <div class="game-container">
          <div class="loading-container" id="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading ${gameTitle}...</div>
          </div>
          <iframe src="${url}" allowfullscreen="true" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        </div>
        
        <script>
          // Function to hide the header and expand the game container
          function hideHeader() {
            const header = document.querySelector('.header');
            const gameContainer = document.querySelector('.game-container');
            
            // Instead of display:none, we'll make it slide up out of view
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
            
            // After animation completes, change display to none
            setTimeout(() => {
              header.style.display = 'none';
              gameContainer.style.top = '0';
            }, 300); // Match the transition time
            
            // Immediately start adjusting the game container
            gameContainer.style.top = '0';
          }
          
          // Add compatibility script
          document.addEventListener('DOMContentLoaded', function() {
            const iframe = document.querySelector('iframe');
            const loading = document.getElementById('loading');
            
            iframe.onload = function() {
              // Hide loading message when iframe loads
              loading.style.display = 'none';
            };
            
            // Fallback for iframe load with reduced timeout
            setTimeout(function() {
              loading.style.display = 'none';
            }, 2000);
          });
        </script>
      </body>
    </html>`;
    
    try {
      // Write the HTML content to the new window
      newWindow.document.open();
      newWindow.document.write(html);
      newWindow.document.close();
      
      // Focus the window to bring it to front
      newWindow.focus();
    } catch (e) {
      console.error("Error opening game:", e);
    }
    
    // Close the dropdown
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 py-2 px-3 text-white dark:text-blue-400 font-medium hover:bg-blue-700 dark:hover:bg-blue-900/30 rounded-md transition-all-medium scale-hover"
        >
          <Gamepad2 className="h-4 w-4 mr-1 animate-pulse" />
          Games
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 p-1 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 animate-scaleIn">
        <div className="p-2 font-medium text-sm text-gray-500 dark:text-gray-400 animate-fadeIn">Popular Games</div>
        {games.map((game, index) => (
          <div key={game.name} className="animate-slideUp" style={{ animationDelay: `${0.05 * (index + 1)}s` }}>
            <DropdownMenuItem 
              className="flex items-center p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-sm transition-all-medium text-gray-700 dark:text-gray-200 transform-hover"
              onClick={() => handleGameSelect(game.url)}
            >
              <Gamepad2 className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
              {game.name}
            </DropdownMenuItem>
            {index < games.length - 1 && (
              <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}