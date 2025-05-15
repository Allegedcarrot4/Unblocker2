import React, { useState } from 'react';
import Home from './home';
import { PasswordProtection } from '@/components/PasswordProtection';

export default function ProtectedHome() {
  // Manage authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PASSWORD = "UNBLOCKER4U";

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <PasswordProtection 
        onAuthenticated={handleAuthenticated} 
        expectedPassword={PASSWORD} 
      />
    );
  }

  return <Home />;
}