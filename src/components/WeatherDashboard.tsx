'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import WeatherStation from './WeatherStation';
import LoadingSpinner from './LoadingSpinner';
import { ProcessedWeatherData } from '@/types/netatmo';
import { useTranslation } from '@/lib/locale-provider';

interface WeatherDashboardProps {
  onAuthRequired: () => void;
}

// Data processing function
const processWeatherData = (data: { body?: { devices?: Array<{ _id: string; station_name: string; place?: { altitude?: number; city?: string; country?: string; timezone?: string; location?: [number, number] }; dashboard_data?: { time_utc: number; Temperature?: number; Humidity?: number; CO2?: number; Pressure?: number; Noise?: number }; modules: Array<{ _id: string; module_name: string; dashboard_data: { time_utc: number; Temperature?: number; Humidity?: number; CO2?: number; Pressure?: number; Noise?: number } }> }> } }): ProcessedWeatherData[] => {
  if (!data?.body?.devices) return [];
  
  return data.body.devices.map((device) => ({
    id: device._id,
    name: device.station_name,
    place: device.place,
    homeBaseData: device.dashboard_data ? {
      ...device.dashboard_data,
      lastUpdate: new Date(device.dashboard_data.time_utc * 1000)
    } : undefined,
    modules: device.modules.map((module) => ({
      id: module._id,
      name: module.module_name,
      data: module.dashboard_data,
      lastUpdate: new Date(module.dashboard_data.time_utc * 1000)
    }))
  }));
};

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('AUTH_REQUIRED');
    }
    throw new Error('Failed to fetch weather data');
  }
  return response.json();
};

export default function WeatherDashboard({ onAuthRequired }: WeatherDashboardProps) {
  const { t } = useTranslation();
  const [processedData, setProcessedData] = useState<ProcessedWeatherData[]>([]);
  
  const { data, error, isLoading, mutate } = useSWR(
    '/api/weather',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      onError: (err) => {
        if (err.message === 'AUTH_REQUIRED') {
          onAuthRequired();
        }
      }
    }
  );

  useEffect(() => {
    if (data) {
      const processed = processWeatherData(data);
      setProcessedData(processed);
    }
  }, [data]);

  const handleRefresh = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            {t('weather.dashboard.errorLoading')}
          </h3>
          <p className="text-red-600 mb-4">
            {error.message === 'AUTH_REQUIRED' 
              ? t('weather.dashboard.pleaseLoginAgain')
              : t('weather.dashboard.errorFetching')}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {t('weather.dashboard.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            {t('weather.dashboard.noStationsFound')}
          </h3>
          <p className="text-yellow-600">
            {t('weather.dashboard.noStationsMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('weather.dashboard.title')}
        </h2>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('weather.dashboard.refresh')}
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {processedData.map((station) => (
          <WeatherStation key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
}
