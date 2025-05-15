import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { UrlForm } from "./UrlForm";
import { StatusDisplay } from "./StatusDisplay";
import { RecentEmbeds } from "./RecentEmbeds";
import { Card, CardContent } from "@/components/ui/card";
import { EmbedHistoryItem, getEmbedHistory } from "@/lib/embeds";

export type EmbedStatus = {
  isOpen: boolean;
  type: "success" | "error" | "info" | "";
  title: string;
  message: string;
};

// Create a type for the ref object that will be exposed to parent components
export type EmbedCardRef = {
  handleEmbed: (url: string) => boolean;
};

export const EmbedCard = forwardRef<EmbedCardRef, {}>((props, ref) => {
  
  // Expose handleEmbed method to parent component
  useImperativeHandle(ref, () => ({
    handleEmbed
  }));
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [embedStatus, setEmbedStatus] = useState<EmbedStatus>({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const [history, setHistory] = useState<EmbedHistoryItem[]>([]);
  const [windowRef, setWindowRef] = useState<Window | null>(null);

  // Load embed history on initial render
  useEffect(() => {
    setHistory(getEmbedHistory());
  }, []);

  // Validate and format URL
  const validateUrl = (inputUrl: string) => {
    if (!inputUrl) {
      return { isValid: false, message: "Please enter a URL" };
    }

    try {
      // Add protocol if missing
      if (!/^https?:\/\//i.test(inputUrl)) {
        inputUrl = "https://" + inputUrl;
      }

      const urlObject = new URL(inputUrl);
      return { isValid: true, url: urlObject.href };
    } catch (e) {
      return { isValid: false, message: "Invalid URL format" };
    }
  };

  const handleEmbed = (inputUrl: string) => {
    // Log that embed function was called
    console.log("handleEmbed called with:", inputUrl);
    
    const validation = validateUrl(inputUrl);

    if (!validation.isValid) {
      setUrlError(validation.message || "Invalid URL");
      return false;
    }

    try {
      // The URL to embed
      const embedUrl = validation.url || '';
      console.log("Attempting to embed URL:", embedUrl);

      // Create new popup window with about:blank
      // This approach works better across browsers (Chrome and Safari)
      const newWindow = window.open("", "_blank");
      
      if (!newWindow) {
        // Handle popup blockers
        setEmbedStatus({
          isOpen: true,
          type: "error",
          title: "Popup Blocked",
          message: "Please allow popups for this website to use the embedding feature.",
        });
        return false;
      }
      
      // Cross-browser compatible approach with better styling for unblocker
      const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Unblocked: ${embedUrl}</title>
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
            .frame-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border: none;
              overflow: hidden;
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
            }
            .loading-spinner {
              border: 3px solid rgba(0, 0, 0, 0.1);
              border-radius: 50%;
              border-top: 3px solid #3b82f6;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 15px auto;
            }
            .loading-text {
              font-size: 16px;
              color: #4b5563;
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
            }
            .header-title {
              font-size: 16px;
              font-weight: bold;
            }
            .btn-close {
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              font-size: 20px;
              line-height: 1;
            }
            .content-area {
              position: absolute;
              top: 40px;
              left: 0;
              right: 0;
              bottom: 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-title">Unblocked: ${new URL(embedUrl).hostname}</div>
            <button class="btn-close" onclick="window.close()">×</button>
          </div>
          
          <div class="content-area">
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <div class="loading-text">Loading ${new URL(embedUrl).hostname}...</div>
            </div>
            <iframe src="${embedUrl}" allowfullscreen="true" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
          </div>
          
          <script>
            // Add compatibility script for Safari and Chrome
            document.addEventListener('DOMContentLoaded', function() {
              const iframe = document.querySelector('iframe');
              const loadingContainer = document.querySelector('.loading-container');
              
              iframe.onload = function() {
                // Hide loading message when iframe loads
                loadingContainer.style.display = 'none';
              };
              
              // Add this to help with Safari compatibility - reduced timeout
              window.onload = function() {
                setTimeout(function() {
                  loadingContainer.style.display = 'none';
                }, 1000);
              };
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
        console.error("Error writing to new window:", e);
      }
      
      console.log("New window created with embedded content");

      // Add to history
      const newHistory = addToHistory(embedUrl || '');
      setHistory(newHistory);

      // Show success message
      setEmbedStatus({
        isOpen: true,
        type: "success",
        title: "Website Unblocked",
        message: `Successfully unblocked ${embedUrl} in a new window. If nothing appeared, please check your popup blocker settings.`,
      });

      return true;
    } catch (error) {
      console.error("Error embedding website:", error);
      
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setEmbedStatus({
        isOpen: true,
        type: "error",
        title: "Unblocking Failed",
        message: `Failed to unblock the website: ${errorMessage}`,
      });
      return false;
    }
  };

  const addToHistory = (url: string): EmbedHistoryItem[] => {
    // Get current history
    let embedHistoryItems = getEmbedHistory();

    // Check if URL is already in history
    const existingIndex = embedHistoryItems.findIndex(
      (item) => item.url === url
    );

    if (existingIndex !== -1) {
      // Remove the existing entry to move it to the top
      embedHistoryItems.splice(existingIndex, 1);
    }

    // Add new entry to the beginning
    embedHistoryItems.unshift({
      url: url,
      timestamp: new Date().toISOString(),
    });

    // Keep only the last 5 entries
    embedHistoryItems = embedHistoryItems.slice(0, 5);

    // Save to localStorage
    localStorage.setItem("embedHistory", JSON.stringify(embedHistoryItems));

    return embedHistoryItems;
  };

  const handleSelectEmbed = (url: string) => {
    handleEmbed(url);
  };

  return (
    <Card className="w-full p-6 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900 transition-all-medium hover:shadow-xl">
      <CardContent className="p-0">
        {/* No header needed here since it's in the main page */}

        {/* URL Input Form */}
        <UrlForm
          onSubmit={handleEmbed}
          setUrlError={setUrlError}
          urlError={urlError}
        />

        {/* Status and History Section */}
        {embedStatus.isOpen && (
          <div className="animate-scaleIn">
            <StatusDisplay
              type={embedStatus.type}
              title={embedStatus.title}
              message={embedStatus.message}
            />
          </div>
        )}

        {/* Recent Embeds History */}
        {history.length > 0 && (
          <div className="animate-slideUp">
            <RecentEmbeds history={history} onSelectEmbed={handleSelectEmbed} />
          </div>
        )}

        {/* Information Section */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-medium text-gray-700 dark:text-gray-300 transform-hover">
              <span>How does this work?</span>
              <span className="transition-all-medium group-open:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-2 animate-slideUp">
              <p>
                This unblocker creates a new window with{" "}
                <code className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 rounded transition-colors">
                  about:blank
                </code>{" "}
                and loads the website in an iframe, bypassing many common restrictions.
              </p>
              <p>
                <strong>Note:</strong> Some websites with strong security measures may still block 
                embedding, especially if they use X-Frame-Options or Content-Security-Policy headers.
              </p>
              <p className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                Your browsing history and bookmarks won't show the unblocked
                sites, providing additional privacy.
              </p>
              <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-1">Browser Compatibility</h4>
                <ul className="list-disc list-inside pl-1 space-y-1">
                  <li className="text-gray-700 dark:text-gray-300"><span className="font-medium">Chrome/Edge:</span> Best compatibility, works with most websites</li>
                  <li className="text-gray-700 dark:text-gray-300"><span className="font-medium">Firefox:</span> Good compatibility with most sites</li>
                  <li className="text-gray-700 dark:text-gray-300"><span className="font-medium">Safari:</span> Compatible but may require pop-up permissions</li>
                  <li className="text-gray-700 dark:text-gray-300"><span className="font-medium">Mobile browsers:</span> Limited support, best on desktop</li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
});

// Add a displayName for better debugging
EmbedCard.displayName = 'EmbedCard';
