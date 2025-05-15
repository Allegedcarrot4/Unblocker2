
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useState, useRef, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import * as z from "zod";
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Schema definitions
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Components
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
  )
);
Card.displayName = "Card";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${className}`}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

// Pages
function NotFound() {
  return <div>404 - Page Not Found</div>;
}

function ProtectedHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1>Protected Home</h1>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <h1 className="text-xl font-bold">My App</h1>
      </nav>
    </header>
  );
}

// Theme Provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {children}
    </div>
  );
}

// Main App Component
function Router() {
  return (
    <Switch>
      <Route path="/" component={ProtectedHome} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Query Client Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Root App Component
function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// Mount the app
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
