import { useState, useRef } from 'react';
import { EmbedCard, EmbedCardRef } from "@/components/EmbedCard";
import { Header } from "@/components/Header";

export default function Home() {
  const embedCardRef = useRef<EmbedCardRef>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 dark:text-white transition-colors duration-300">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center animate-slideUp">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-2 transition-colors gradient-heading">Access Any Website</h2>
            <p className="text-gray-600 dark:text-gray-300 transition-colors animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              Bypass restrictions and browse freely with our secure unblocker
            </p>
          </div>
          
          <div className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <EmbedCard ref={embedCardRef} />
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <p>© {new Date().getFullYear()} Web Unblocker - Providing unrestricted web access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
