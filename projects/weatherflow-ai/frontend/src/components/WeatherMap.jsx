
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configuration des icônes Leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function WeatherMap({ weather }) {
  const position = [
    Number(weather.latitude),
    Number(weather.longitude),
  ];

  return (
    <section id="weather-map" className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111a2c]">

      <div className="flex items-center gap-3 p-6">
        <div className="rounded-xl bg-blue-500/10 p-3">
          <MapPin size={23} className="text-blue-400" />
        </div>

        <div>
          <h3 className="text-xl font-bold">
            Localisation géographique
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            Position météorologique de {weather.city}
          </p>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position} icon={markerIcon}>
            <Popup>
              <strong>{weather.city}</strong>
              <br />
              Température : {weather.temperature} °C
              <br />
              {weather.description}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="p-4 text-xs text-gray-500">
        Latitude : {weather.latitude} | Longitude : {weather.longitude}
      </div>

    </section>
  );
}

export default WeatherMap;
