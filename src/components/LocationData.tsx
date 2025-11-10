'use client';

import { NetatmoPlace } from '@/types/netatmo';

interface LocationDataProps {
  place: NetatmoPlace;
}

export default function LocationData({ place }: LocationDataProps) {
  const { city, country, altitude, timezone, location } = place;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
      <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Standort
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        {city && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stadt</p>
              <p className="text-lg font-semibold text-gray-700">
                {city}
              </p>
            </div>
          </div>
        )}

        {country && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Land</p>
              <p className="text-lg font-semibold text-gray-700">
                {country}
              </p>
            </div>
          </div>
        )}

        {altitude !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Höhe</p>
              <p className="text-lg font-semibold text-gray-700">
                {altitude.toFixed(0)} m
              </p>
            </div>
          </div>
        )}

        {timezone && (
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Zeitzone</p>
              <p className="text-lg font-semibold text-gray-700">
                {timezone}
              </p>
            </div>
          </div>
        )}

        {location && location.length === 2 && (
          <div className="flex items-center space-x-2 col-span-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Koordinaten</p>
              <p className="text-lg font-semibold text-gray-700">
                {location[1].toFixed(6)}°N, {location[0].toFixed(6)}°E
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

