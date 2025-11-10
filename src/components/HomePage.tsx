'use client';

import { useState, useEffect } from 'react';
import WeatherDashboard from '@/components/WeatherDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if weather data can be fetched (token is configured)
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/weather');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Fehler beim Laden der Wetterdaten.');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Weather data fetch error:', err);
        setError('Netzwerkfehler beim Laden der Wetterdaten.');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Netatmo Wetterstation
          </h1>
          <p className="text-lg text-gray-600">
            Deine persönlichen Wetterdaten im Überblick
          </p>
        </header>

        {error && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Fehler
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated ? (
          <WeatherDashboard onAuthRequired={handleAuthSuccess} />
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Konfiguration erforderlich
                </h2>
                <p className="text-gray-600 mb-6">
                  Bitte konfiguriere den NETATMO_ACCESS_TOKEN in deiner .env.local Datei.
                </p>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>
                  Siehe README.md für Anweisungen zum Erstellen eines Access Tokens.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
