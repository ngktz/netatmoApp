'use client';

import { ProcessedWeatherData } from '@/types/netatmo';
import WeatherModule from './WeatherModule';
import LocationData from './LocationData';
import { useTranslation } from '@/lib/locale-provider';

interface WeatherStationProps {
  station: ProcessedWeatherData;
}

export default function WeatherStation({ station }: WeatherStationProps) {
  const { t } = useTranslation();
  const lastUpdate = station.homeBaseData?.lastUpdate || station.modules[0]?.lastUpdate;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {station.name}
        </h3>
        {lastUpdate && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lastUpdate.toLocaleTimeString('de-DE')}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {station.place && (
          <LocationData place={station.place} />
        )}
        
        {station.homeBaseData && (
          <WeatherModule 
            module={{
              id: station.id,
              name: t('weather.module.homeBase'),
              data: {
                time_utc: station.homeBaseData.time_utc,
                Temperature: station.homeBaseData.Temperature,
                Humidity: station.homeBaseData.Humidity,
                CO2: station.homeBaseData.CO2,
                Pressure: station.homeBaseData.Pressure,
                Noise: station.homeBaseData.Noise,
              },
              lastUpdate: station.homeBaseData.lastUpdate,
            }}
          />
        )}
        
        {station.modules.map((module) => (
          <WeatherModule key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
}
