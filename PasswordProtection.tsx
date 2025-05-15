import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from 'lucide-react';

type PasswordProtectionProps = {
  onAuthenticated: () => void;
  expectedPassword: string;
};

export function PasswordProtection({ onAuthenticated, expectedPassword }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // Check if user has previously authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem('unblocker_authenticated');
    if (isAuth === 'true') {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  // Handle countdown for lockout
  useEffect(() => {
    let interval: number | null = null;
    
    if (isLocked && lockTime > 0) {
      interval = window.setInterval(() => {
        setLockTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, lockTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === expectedPassword) {
      // Save authentication state to localStorage
      localStorage.setItem('unblocker_authenticated', 'true');
      onAuthenticated();
      return;
    }
    
    // Handle incorrect password
    setIsError(true);
    setAttempts(prev => {
      const newAttempts = prev + 1;
      // Lock after 3 attempts
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTime(30); // Lock for 30 seconds
      }
      return newAttempts;
    });
    
    // Clear password field
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg border border-blue-100 dark:border-blue-900">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Password Protected</h1>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              This unblocker requires a password to access. Please enter the correct password to continue.
            </p>
          </div>
          
          {isLocked ? (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Too many failed attempts. Please wait {lockTime} seconds before trying again.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsError(false);
                  }}
                  className={`w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    isError ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="Enter the password"
                  autoComplete="off"
                  disabled={isLocked}
                />
                {isError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Incorrect password. {3 - attempts} attempts remaining.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded transition-all duration-200"
                disabled={isLocked || !password.length}
              >
                Unlock
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}