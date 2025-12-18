import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons not showing in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bengaluru coordinates
  const position = [12.9716, 77.5946];

  useEffect(() => {
    // Fetching from Open Charge Map
    const fetchStations = async () => {
      try {
        const response = await fetch(
          `https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN&town=Bengaluru&maxresults=20&key=bbaaede1-e480-4cf1-bfa8-942e4c86ac26`
        );
        const data = await response.json();
        setStations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1 style={{ textAlign: 'center', padding: '10px' }}>Bengaluru EV Tracker (Live)</h1>
      
      {loading ? <p>Loading stations...</p> : (
        <MapContainer center={position} zoom={12} style={{ height: "90%", width: "100%" }}>
          {/* TileLayer is the actual map "skin" (OpenStreetMap is free) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {stations.map((station) => (
            <Marker 
              key={station.ID} 
              position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]}
            >
              <Popup>
                <strong>{station.AddressInfo.Title}</strong> <br />
                Status: {station.StatusType ? station.StatusType.Title : "Unknown"} <br />
                Connectors: {station.Connections.length}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default App;