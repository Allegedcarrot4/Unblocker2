import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Youtube, Video, Film, PlayCircle } from 'lucide-react';

type VideoSite = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

export function VideosTab() {
  const [isOpen, setIsOpen] = useState(false);

  const videoSites: VideoSite[] = [
    { 
      name: "YouTube", 
      url: "https://youtube.com/", 
      icon: <Youtube className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
    },
    { 
      name: "Twitch", 
      url: "https://twitch.tv/", 
      icon: <PlayCircle className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" /> 
    },
    { 
      name: "TikTok", 
      url: "https://tiktok.com/", 
      icon: <Video className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" /> 
    },
    { 
      name: "Netflix", 
      url: "https://netflix.com/", 
      icon: <Film className="h-4 w-4 mr-2 text-red-800 dark:text-red-600" /> 
    },
  ];

  const handleVideoSiteSelect = (url: string, siteName: string) => {
    // Create new popup window with about:blank
    const newWindow = window.open("", "_blank");
    
    if (!newWindow) {
      alert("Popup blocked! Please allow popups for this website to access videos.");
      return;
    }
    
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${siteName}</title>
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
          .video-container {
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
              <path d="M14 12l-3.5 2v-4l3.5 2z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" stroke-width="2" />
            </svg>
            ${siteName}
          </div>
          <button class="btn-close" onclick="hideHeader()">×</button>
        </div>
        
        <div class="video-container">
          <div class="loading-container" id="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading ${siteName}...</div>
          </div>
          <iframe src="${url}" allowfullscreen="true" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        </div>
        
        <script>
          // Function to hide the header and expand the video container
          function hideHeader() {
            const header = document.querySelector('.header');
            const videoContainer = document.querySelector('.video-container');
            
            // Instead of display:none, we'll make it slide up out of view
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
            
            // After animation completes, change display to none
            setTimeout(() => {
              header.style.display = 'none';
              videoContainer.style.top = '0';
            }, 300); // Match the transition time
            
            // Immediately start adjusting the video container
            videoContainer.style.top = '0';
          }
          
          // Add compatibility script
          document.addEventListener('DOMContentLoaded', function() {
            const iframe = document.querySelector('iframe');
            const loading = document.getElementById('loading');
            
            iframe.onload = function() {
              // Hide loading message when iframe loads
              loading.style.display = 'none';
            };
            
            // Shorter fallback for iframe load - only 3 seconds
            setTimeout(function() {
              loading.style.display = 'none';
            }, 3000);
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
      console.error(`Error opening ${siteName}:`, e);
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
          className="flex items-center gap-1 py-2 px-3 text-white dark:text-blue-400 font-medium hover:bg-blue-700 dark:hover:bg-blue-900/30 rounded-md transition-all"
        >
          <Youtube className="h-4 w-4 mr-1" />
          Videos
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 p-1 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
        <div className="p-2 font-medium text-sm text-gray-500 dark:text-gray-400">Video Sites</div>
        {videoSites.map((site, index) => (
          <div key={site.name}>
            <DropdownMenuItem 
              className="flex items-center p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-sm transition-all text-gray-700 dark:text-gray-200"
              onClick={() => handleVideoSiteSelect(site.url, site.name)}
            >
              {site.icon}
              {site.name}
            </DropdownMenuItem>
            {index < videoSites.length - 1 && (
              <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}