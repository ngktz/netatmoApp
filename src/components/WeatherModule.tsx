'use client';

import { useTranslation } from '@/lib/locale-provider';

interface WeatherModuleProps {
  module: {
    id: string;
    name: string;
    data: {
      time_utc: number;
      Temperature?: number;
      Humidity?: number;
      CO2?: number;
      Pressure?: number;
      Noise?: number;
    };
    lastUpdate: Date;
  };
}

const formatValue = (value: number | undefined, unit: string, decimals = 1, notAvailable: string = 'N/A'): string => {
  if (value === undefined) return notAvailable;
  return `${value.toFixed(decimals)} ${unit}`;
};

const getTemperatureColor = (temp: number | undefined): string => {
  if (temp === undefined) return 'text-gray-500';
  if (temp < 0) return 'text-blue-600';
  if (temp < 10) return 'text-blue-500';
  if (temp < 20) return 'text-green-500';
  if (temp < 30) return 'text-yellow-500';
  return 'text-red-500';
};

const getHumidityColor = (humidity: number | undefined): string => {
  if (humidity === undefined) return 'text-gray-500';
  if (humidity < 30) return 'text-red-500';
  if (humidity < 50) return 'text-yellow-500';
  if (humidity < 70) return 'text-green-500';
  return 'text-blue-500';
};

const getCO2Color = (co2: number | undefined): string => {
  if (co2 === undefined) return 'text-gray-500';
  if (co2 < 400) return 'text-green-500';
  if (co2 < 800) return 'text-yellow-500';
  if (co2 < 1200) return 'text-orange-500';
  return 'text-red-500';
};

export default function WeatherModule({ module }: WeatherModuleProps) {
  const { t } = useTranslation();
  const { name, data } = module;
  const { Temperature, Humidity, CO2, Pressure, Noise } = data;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="text-lg font-medium text-gray-800 mb-3">
        {name}
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        {Temperature !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('weather.module.temperature')}</p>
              <p className={`text-lg font-semibold ${getTemperatureColor(Temperature)}`}>
                {formatValue(Temperature, '°C', 1, t('weather.module.notAvailable'))}
              </p>
            </div>
          </div>
        )}

        {Humidity !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('weather.module.humidity')}</p>
              <p className={`text-lg font-semibold ${getHumidityColor(Humidity)}`}>
                {formatValue(Humidity, '%', 1, t('weather.module.notAvailable'))}
              </p>
            </div>
          </div>
        )}

        {CO2 !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('weather.module.co2')}</p>
              <p className={`text-lg font-semibold ${getCO2Color(CO2)}`}>
                {formatValue(CO2, 'ppm', 0, t('weather.module.notAvailable'))}
              </p>
            </div>
          </div>
        )}

        {Pressure !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('weather.module.pressure')}</p>
              <p className="text-lg font-semibold text-gray-700">
                {formatValue(Pressure, 'mbar', 1, t('weather.module.notAvailable'))}
              </p>
            </div>
          </div>
        )}

        {Noise !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('weather.module.noise')}</p>
              <p className="text-lg font-semibold text-gray-700">
                {formatValue(Noise, 'dB', 0, t('weather.module.notAvailable'))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
