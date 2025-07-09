'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
// import { confirmWeatherAlert, type ActionState } from '@/lib/actions/incident.actions';
import { X, CheckCircle, XCircle, Sun, Cloudy, CloudRain, Wind, Droplets } from 'lucide-react';
import { ActionState, confirmWeatherAlert } from '@/lib/actions/incident.actions';

// Define the shape of the weather data we expect from the API
interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  main: string; // e.g., "Clouds", "Rain", "Clear"
  wind: number;
  humidity: number;
  rawData: string; // Store the full stringified response
}

// Helper to get a nice icon based on the weather condition
const getWeatherIcon = (main: string, size = 48) => {
  switch (main) {
    case 'Clouds': return <Cloudy size={size} className="text-slate-400" />;
    case 'Rain': return <CloudRain size={size} className="text-blue-400" />;
    case 'Clear': return <Sun size={size} className="text-yellow-400" />;
    default: return <Cloudy size={size} className="text-slate-400" />;
  }
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-bold text-lg">
      {pending ? 'Confirming...' : 'Confirm & Report Alert'}
    </button>
  );
}

export function WeatherAlertModal({ onClose }: { onClose: () => void }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const initialState: ActionState = {};
  const [state, formAction] = useActionState(confirmWeatherAlert, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch weather data when the modal mounts
  useEffect(() => {
    const fetchWeather = async () => {
      // Coordinates for Bambili, Cameroon
      const lat = 6.03;
      const lon = 10.25;
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY!;
      console.log("my api key is:", apiKey)
      
      if (!apiKey) {
        setError('Weather API key is not co nfigured.');
        setLoading(false);
        return;
      }
      
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
        const data = await res.json();
        
        setWeather({
          location: data.name,
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
          main: data.weather[0].main,
          wind: Math.round(data.wind.speed * 3.6), // m/s to kph
          humidity: data.main.humidity,
          rawData: JSON.stringify(data), // Store full response
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch weather data.');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  // Effect to handle form submission result
  useEffect(() => {
    if (state.message) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.message, onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-sm mx-4 shadow-2xl overflow-hidden">
        {/* The beautiful SVG-like weather card */}
        <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 relative">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10">
            <X size={24} />
          </button>
          
          {loading && <p className="text-center py-20">Fetching weather data...</p>}
          {error && <p className="text-center py-20 text-red-400">{error}</p>}

          {weather && (
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold">{weather.location}</h2>
              <p className="text-slate-400 capitalize">{weather.condition}</p>
              
              <div className="my-6 flex justify-center items-center gap-2">
                {getWeatherIcon(weather.main, 64)}
                <span className="text-7xl font-light tracking-tighter">{weather.temp}°C</span>
              </div>
              
              <div className="flex justify-around text-sm">
                <div className="flex items-center gap-2">
                  <Wind size={16} className="text-slate-400"/> {weather.wind} km/h
                </div>
                <div className="flex items-center gap-2">
                  <Droplets size={16} className="text-slate-400"/> {weather.humidity}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* The Form area */}
        {weather && !loading && (
          <div className="p-4 bg-slate-800/50">
            <form ref={formRef} action={formAction}>
              {/* Hidden inputs to pass data to the server action */}
              <input type="hidden" name="location" value={weather.location} />
              <input type="hidden" name="temperature" value={weather.temp} />
              <input type="hidden" name="condition" value={weather.condition} />
              <input type="hidden" name="windSpeed" value={weather.wind} />
              <input type="hidden" name="humidity" value={weather.humidity} />
              <input type="hidden" name="rawData" value={weather.rawData} />
              
              <SubmitButton />
            </form>
            {state.message && <p className="text-green-400 flex items-center gap-2 mt-4 text-center justify-center"><CheckCircle size={16}/> {state.message}</p>}
            {state.error && <p className="text-red-400 flex items-center gap-2 mt-4 text-center justify-center"><XCircle size={16}/> {state.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}