// Netatmo API Types
export interface NetatmoPlace {
  altitude?: number;
  city?: string;
  country?: string;
  timezone?: string;
  location?: [number, number]; // [longitude, latitude]
}

export interface NetatmoWeatherData {
  body: {
    devices: Array<{
      _id: string;
      station_name: string;
      place?: NetatmoPlace;
      dashboard_data?: {
        time_utc: number;
        Temperature?: number;
        Humidity?: number;
        CO2?: number;
        Pressure?: number;
        Noise?: number;
      };
      modules: Array<{
        _id: string;
        module_name: string;
        data_type: string[];
        dashboard_data: {
          time_utc: number;
          Temperature?: number;
          Humidity?: number;
          CO2?: number;
          Pressure?: number;
          Noise?: number;
        };
      }>;
    }>;
  };
}

export interface ProcessedWeatherData {
  id: string;
  name: string;
  place?: NetatmoPlace;
  homeBaseData?: {
    time_utc: number;
    Temperature?: number;
    Humidity?: number;
    CO2?: number;
    Pressure?: number;
    Noise?: number;
    lastUpdate: Date;
  };
  modules: Array<{
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
  }>;
}

export interface NetatmoAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface NetatmoApiError {
  error: {
    code: number;
    message: string;
  };
}

export interface NetatmoConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiBaseUrl: string;
}
