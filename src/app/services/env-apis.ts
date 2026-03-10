/**
 * Environment & Context APIs — frontend-only, no backend.
 * All fetch calls run from the browser. Use VITE_* env vars for optional API keys.
 */

// Default coords (fallback if geo fails)
const DEFAULT_LAT = 37.7749;
const DEFAULT_LON = -122.4194;

export interface GeoLocation {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  pressure: number;
  uvIndex: number;
  condition: string;
  windSpeed: number;
  feelsLike: number;
}

export interface AirQualityData {
  pm25: number;
  pm10: number;
  aqi: number;
  usAqi: number;
  level: "good" | "moderate" | "unhealthy" | "very_unhealthy" | "hazardous";
}

export interface SunData {
  sunrise: string;
  sunset: string;
  dayLength: number; // seconds
  solarNoon: string;
}

export interface PollenData {
  grass: number;
  tree: number;
  weed: number;
  level: "low" | "moderate" | "high" | "very_high";
}

export interface NewsHeadline {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export interface EnvironmentContext {
  geo: GeoLocation;
  weather: WeatherData;
  airQuality: AirQualityData;
  sun: SunData;
  pollen?: PollenData;
  news?: NewsHeadline[];
  fetchedAt: number;
}

// --- Geolocation (IP-API, free, no key) ---
export async function fetchGeo(): Promise<GeoLocation> {
  try {
    const r = await fetch("https://ipapi.co/json/");
    if (!r.ok) throw new Error("Geo fetch failed");
    const d = await r.json();
    return {
      lat: d.latitude ?? DEFAULT_LAT,
      lon: d.longitude ?? DEFAULT_LON,
      city: d.city,
      country: d.country_name,
      timezone: d.timezone,
    };
  } catch {
    return { lat: DEFAULT_LAT, lon: DEFAULT_LON };
  }
}

// --- Weather (Open-Meteo, free, no key, CORS) ---
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,surface_pressure,weather_code,wind_speed_10m,apparent_temperature");
    url.searchParams.set("daily", "uv_index_max,sunrise,sunset");
    url.searchParams.set("timezone", "auto");

    const r = await fetch(url.toString());
    if (!r.ok) throw new Error("Weather fetch failed");
    const d = await r.json();

    const uv = d.daily?.uv_index_max?.[0] ?? 0;
    const code = d.current?.weather_code ?? 0;
    const condition = weatherCodeToLabel(code);

    return {
      temp: d.current?.temperature_2m ?? 20,
      humidity: d.current?.relative_humidity_2m ?? 50,
      pressure: d.current?.surface_pressure ?? 1013,
      uvIndex: Math.round(uv * 10) / 10,
      condition,
      windSpeed: d.current?.wind_speed_10m ?? 0,
      feelsLike: d.current?.apparent_temperature ?? d.current?.temperature_2m ?? 20,
    };
  } catch {
    return {
      temp: 20,
      humidity: 50,
      pressure: 1013,
      uvIndex: 5,
      condition: "Unknown",
      windSpeed: 0,
      feelsLike: 20,
    };
  }
}

// --- Air Quality (Open-Meteo, free, no key) ---
export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  try {
    const url = new URL("https://air-quality.api.open-meteo.com/v1/air-quality");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("current", "us_aqi,pm2_5,pm10");

    const r = await fetch(url.toString());
    if (!r.ok) throw new Error("AQ fetch failed");
    const d = await r.json();

    const pm25 = d.current?.pm2_5 ?? 10;
    const pm10 = d.current?.pm10 ?? 15;
    const usAqi = d.current?.us_aqi ?? 50;

    return {
      pm25,
      pm10,
      aqi: usAqi,
      usAqi,
      level: aqiToLevel(usAqi),
    };
  } catch {
    return {
      pm25: 10,
      pm10: 15,
      aqi: 50,
      usAqi: 50,
      level: "good",
    };
  }
}

// --- Sun (Open-Meteo daily sunrise/sunset, same API) ---
export async function fetchSunData(lat: number, lon: number): Promise<SunData> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("daily", "sunrise,sunset,sunshine_duration");
    url.searchParams.set("timezone", "auto");

    const r = await fetch(url.toString());
    if (!r.ok) throw new Error("Sun fetch failed");
    const d = await r.json();

    const sunrise = d.daily?.sunrise?.[0] ?? "06:00";
    const sunset = d.daily?.sunset?.[0] ?? "18:00";
    const sunSecs = d.daily?.sunshine_duration?.[0] ?? 43200;

    return {
      sunrise: sunrise.split("T")[1]?.slice(0, 5) ?? "06:00",
      sunset: sunset.split("T")[1]?.slice(0, 5) ?? "18:00",
      dayLength: sunSecs,
      solarNoon: "12:00",
    };
  } catch {
    return {
      sunrise: "06:00",
      sunset: "18:00",
      dayLength: 43200,
      solarNoon: "12:00",
    };
  }
}

// --- Pollen (Open-Meteo, when available) ---
export async function fetchPollen(lat: number, lon: number): Promise<PollenData | null> {
  try {
    const url = new URL("https://air-quality.api.open-meteo.com/v1/air-quality");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("current", "grass_pollen,tree_pollen,weed_pollen");

    const r = await fetch(url.toString());
    if (!r.ok) return null;
    const d = await r.json();

    const grass = d.current?.grass_pollen ?? 0;
    const tree = d.current?.tree_pollen ?? 0;
    const weed = d.current?.weed_pollen ?? 0;
    const max = Math.max(grass, tree, weed);

    return {
      grass,
      tree,
      weed,
      level: pollenToLevel(max),
    };
  } catch {
    return null;
  }
}

// --- News (NewsAPI - requires key in VITE_NEWS_API_KEY) ---
export async function fetchNews(): Promise<NewsHeadline[]> {
  const key = import.meta.env.VITE_NEWS_API_KEY;
  if (!key) return [];

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${key}`;
    const r = await fetch(url);
    if (!r.ok) return [];
    const d = await r.json();
    if (d.status !== "ok" || !Array.isArray(d.articles)) return [];

    return d.articles.slice(0, 5).map((a: { title?: string; source?: { name?: string }; url?: string; publishedAt?: string }) => ({
      title: a.title ?? "",
      source: a.source?.name ?? "Unknown",
      url: a.url ?? "#",
      publishedAt: a.publishedAt ?? "",
    }));
  } catch {
    return [];
  }
}

// --- Optional: OpenWeatherMap (VITE_OPENWEATHER_API_KEY) ---
export async function fetchWeatherOpenWeather(lat: number, lon: number): Promise<WeatherData | null> {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!key) return null;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();

    return {
      temp: d.main?.temp ?? 20,
      humidity: d.main?.humidity ?? 50,
      pressure: d.main?.pressure ?? 1013,
      uvIndex: 0, // needs separate One Call for UV
      condition: d.weather?.[0]?.main ?? "Unknown",
      windSpeed: d.wind?.speed ?? 0,
      feelsLike: d.main?.feels_like ?? d.main?.temp ?? 20,
    };
  } catch {
    return null;
  }
}

// --- Aggregate: fetch all environment context ---
export async function fetchEnvironmentContext(): Promise<EnvironmentContext> {
  const geo = await fetchGeo();

  const [owWeather, weather, airQuality, sun, pollen, news] = await Promise.all([
    fetchWeatherOpenWeather(geo.lat, geo.lon),
    fetchWeather(geo.lat, geo.lon),
    fetchAirQuality(geo.lat, geo.lon),
    fetchSunData(geo.lat, geo.lon),
    fetchPollen(geo.lat, geo.lon),
    fetchNews(),
  ]);

  return {
    geo,
    weather: owWeather ?? weather,
    airQuality,
    sun,
    pollen: pollen ?? undefined,
    news: news.length > 0 ? news : undefined,
    fetchedAt: Date.now(),
  };
}

// --- Helpers ---
function weatherCodeToLabel(code: number): string {
  const map: Record<number, string> = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Drizzle",
    53: "Drizzle",
    55: "Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy showers",
    85: "Snow showers",
    86: "Heavy snow",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };
  return map[code] ?? "Unknown";
}

function aqiToLevel(aqi: number): AirQualityData["level"] {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "unhealthy";
  if (aqi <= 200) return "very_unhealthy";
  return "hazardous";
}

function pollenToLevel(max: number): PollenData["level"] {
  if (max <= 30) return "low";
  if (max <= 90) return "moderate";
  if (max <= 150) return "high";
  return "very_high";
}
