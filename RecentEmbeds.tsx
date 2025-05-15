import React from "react";
import { EmbedHistoryItem } from "@/lib/embeds";

type RecentEmbedsProps = {
  history: EmbedHistoryItem[];
  onSelectEmbed: (url: string) => void;
};

export function RecentEmbeds({ history, onSelectEmbed }: RecentEmbedsProps) {
  // Get relative time string
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "Just now";
  };

  return (
    <div className="space-y-2 mt-6 animate-fadeIn">
      <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400 animate-fadeIn">Recently Unblocked Sites</h3>
      <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all-medium hover:shadow-md">
        {history.map((item, index) => {
          const hostname = new URL(item.url).hostname;
          const timeAgo = getTimeAgo(item.timestamp);
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

          return (
            <li
              key={index}
              className="px-4 py-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all-medium cursor-pointer transform-hover animate-slideUp"
              onClick={() => onSelectEmbed(item.url)}
              style={{ animationDelay: `${0.05 * (index + 1)}s` }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-200 dark:border-blue-700 transition-all-medium hover:bg-blue-200 dark:hover:bg-blue-800">
                    <span className="text-blue-700 dark:text-blue-300 text-xs font-bold">
                      {hostname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="truncate max-w-[200px]">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {hostname}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {timeAgo}
                    </div>
                  </div>
                </div>
                <button className="text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300 transition-colors scale-hover">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
