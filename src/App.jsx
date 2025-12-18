import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- 1. Fix Leaflet Icons (Crucial for showing markers in React) ---
// This part defines the Green and Red markers using a reliable CDN
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function App() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bengaluru Coordinates
  const position = [12.9716, 77.5946];

  // --- 2. Fetching Real-Time Data ---
  useEffect(() => {
    const fetchStations = async () => {
      try {
        // Using the API Key from your Vercel screenshot
        const apiKey = "0baaede1-e480-4cf1-bfa8-942ea4c86ac26"; 
        const response = await fetch(
          `https://api.openchargemap.io/v3/poi/?output=json&latitude=12.9716&longitude=77.5946&distance=15&distanceunit=KM&maxresults=50&key=${apiKey}`
        );
        const data = await response.json();
        setStations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching EV data:", error);
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // --- 3. UI Rendering ---
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1 style={{ textAlign: 'center', padding: '10px', backgroundColor: '#222', color: 'white', margin: 0 }}>
        Bengaluru EV Tracker (Live)
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Loading Bengaluru EV Stations...</h2>
        </div>
      ) : (
        <MapContainer center={position} zoom={12} style={{ height: "90%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {stations.map((station) => (
            <Marker
              key={station.ID}
              position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]}
              // Status ID 50 = Available (Green), anything else is Red
              icon={station.StatusType?.ID === 50 ? greenIcon : redIcon}
            >
              <Popup>
                <div style={{ fontSize: '14px' }}>
                  <strong style={{ fontSize: '16px' }}>{station.AddressInfo.Title}</strong> <br />
                  <hr />
                  <strong>Status:</strong> 
                  <span style={{ color: station.StatusType?.ID === 50 ? 'green' : 'red', fontWeight: 'bold' }}>
                    {" "}{station.StatusType ? station.StatusType.Title : "Unknown"}
                  </span> <br />
                  <strong>Connectors:</strong> {station.Connections?.length || 0} <br />
                  <strong>Address:</strong> {station.AddressInfo.AddressLine1}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default App;