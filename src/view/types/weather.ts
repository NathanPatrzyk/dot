export type WeatherData = {
  temperature: number;
  code: number;
  city: string;
};

export type OpenWeatherResponse = {
  main: {
    temp: number;
  };
  weather: {
    id: number;
  }[];
  name: string;
};
