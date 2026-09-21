"use client";

import { OpenWeatherResponse, WeatherData } from "@/types/weather";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";

const weatherMap: Record<
  number,
  { bg: string; label: string; icon: typeof Sun }
> = {
  800: { bg: "bg-yellow-400", label: "Céu limpo", icon: Sun },
  801: { bg: "bg-sky-400", label: "Poucas nuvens", icon: CloudSun },
  802: { bg: "bg-sky-400", label: "Nuvens dispersas", icon: CloudSun },
  803: { bg: "bg-slate-300", label: "Nublado", icon: Cloud },
  804: { bg: "bg-slate-300", label: "Nublado", icon: Cloud },
};

const weatherGroupMap: Record<
  number,
  { bg: string; label: string; icon: typeof Sun }
> = {
  2: { bg: "bg-indigo-500", label: "Tempestade", icon: CloudLightning },
  3: { bg: "bg-blue-300", label: "Garoa", icon: CloudDrizzle },
  5: { bg: "bg-blue-500", label: "Chuva", icon: CloudRain },
  6: { bg: "bg-slate-100", label: "Neve", icon: CloudSnow },
  7: { bg: "bg-gray-300", label: "Neblina", icon: CloudFog },
};

function getWeatherIcon(code: number) {
  const group = Math.floor(code / 100);
  return (
    weatherMap[code] ??
    weatherGroupMap[group] ?? {
      bg: "bg-neutral-300",
      label: "Sem dados",
      icon: Cloud,
    }
  );
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);

      if (!res.ok) {
        return;
      }

      const data: OpenWeatherResponse = await res.json();

      setWeather({
        temperature: data.main.temp,
        code: data.weather[0].id,
        city: data.name,
      });
    });
  }, []);

  if (!weather) {
    return null;
  }

  const { bg, label, icon: Icon } = getWeatherIcon(weather.code);

  return (
    <div className="relative flex size-36 shrink-0 flex-col rounded-xl bg-neutral-800 px-2 pb-4 pt-3 text-background">
      <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-t-xs bg-background" />
      <span className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md">
        <span className={`px-2 flex flex-1 flex-col justify-center gap-0.5 ${bg}`}>
          <div className="flex gap-1">
            <Icon className="size-6 shrink-0" />
            <span className="truncate">{label}</span>
          </div>
          <span className="text-4xl">{Math.round(weather.temperature)}°</span>
          <span className="truncate">{weather.city}</span>
        </span>
      </span>
      <span className="absolute bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 bg-background [clip-path:polygon(0_0,100%_0,50%_100%)]" />
    </div>
  );
}
