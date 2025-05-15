import React from "react";

type StatusDisplayProps = {
  type: "success" | "error" | "info" | "";
  title: string;
  message: string;
};

export function StatusDisplay({ type, title, message }: StatusDisplayProps) {
  // Set appropriate styling based on type
  let statusClasses = "mb-4 p-4 rounded-md border-l-4 shadow-sm transition-all-medium animate-scaleIn";
  let titleClasses = "text-sm font-medium";
  let iconSvg = null;

  if (type === "success") {
    statusClasses += " bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500";
    titleClasses += " text-green-800 dark:text-green-300";
    iconSvg = (
      <svg
        className="h-5 w-5 text-green-500 dark:text-green-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else if (type === "error") {
    statusClasses += " bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500";
    titleClasses += " text-red-800 dark:text-red-300";
    iconSvg = (
      <svg
        className="h-5 w-5 text-red-500 dark:text-red-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else {
    statusClasses += " bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500";
    titleClasses += " text-blue-800 dark:text-blue-300";
    iconSvg = (
      <svg
        className="h-5 w-5 text-blue-500 dark:text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <div className={statusClasses}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5 animate-pulse">{iconSvg}</div>
        <div className="ml-3 flex-1">
          <h3 className={`${titleClasses} animate-fadeIn`} style={{ animationDelay: '0.1s' }}>{title}</h3>
          <div className="mt-1 text-sm opacity-90 animate-fadeIn" style={{ animationDelay: '0.2s' }}>{message}</div>
        </div>
      </div>
    </div>
  );
}
