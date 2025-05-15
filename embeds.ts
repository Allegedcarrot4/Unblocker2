export interface EmbedHistoryItem {
  url: string;
  timestamp: string;
}

// Function to get embed history from localStorage
export function getEmbedHistory(): EmbedHistoryItem[] {
  const storedHistory = localStorage.getItem("embedHistory");
  if (!storedHistory) return [];
  
  try {
    return JSON.parse(storedHistory) as EmbedHistoryItem[];
  } catch (e) {
    console.error("Failed to parse embed history from localStorage:", e);
    return [];
  }
}

// Validate and format URL
export function validateUrl(url: string): { isValid: boolean; url?: string; message?: string } {
  if (!url) {
    return { isValid: false, message: "Please enter a URL" };
  }
  
  try {
    // Clean up URL - trim whitespace
    url = url.trim();
    
    // Special case for HTML content
    if (url.toLowerCase() === "html") {
      const staticHtmlUrl = "https://example.com";
      console.log("Using example.com for HTML demo");
      return { isValid: true, url: staticHtmlUrl };
    }
    
    // Basic validation for domain format before adding protocol
    // Allow domains like: google.com, www.google.com, sub.domain.co.uk
    const isDomainLike = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/i.test(url);
    
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      // If it looks like a domain, add https://
      if (isDomainLike || url.includes(".")) {
        url = "https://" + url;
      }
      // Otherwise, it might be another format or invalid
    }
    
    // Attempt to create URL object to validate
    const urlObject = new URL(url);
    
    // Ensure it has a valid hostname (at least one dot)
    if (!urlObject.hostname.includes(".")) {
      return { isValid: false, message: "Please enter a valid website address" };
    }
    
    console.log("URL validated:", urlObject.href);
    return { isValid: true, url: urlObject.href };
  } catch (e) {
    console.error("URL validation error:", e);
    
    // Provide more user-friendly error messages
    if (url.includes(".")) {
      return { isValid: false, message: "Please enter a complete website address (e.g., google.com)" };
    }
    
    return { isValid: false, message: "Please enter a valid website address" };
  }
}
