import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'
import { Maximize2, Minimize2, Map, Satellite, Navigation } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Unique colors for each bank (must match FilterBar.jsx)
const BANK_COLORS = {
  alrajhi: '#004D3D',
  snb: '#1E3A8A',
  riyad: '#7C3AED',
  albilad: '#059669',
  alinma: '#0891B2',
  bsf: '#DC2626',
  anb: '#D97706',
  aljazira: '#4F46E5',
  saib: '#DB2777',
  emiratesnbd: '#65A30D'
}

// Create colored pin icon
const createPinIcon = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="${color}" stroke="#FFFFFF" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z"/>
      <circle fill="#FFFFFF" cx="12" cy="12" r="5"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: 'custom-pin-icon',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36]
  })
}

// Blue dot icon for current location
const createBlueDotIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="#4285F4" fill-opacity="0.2"/>
      <circle cx="12" cy="12" r="6" fill="#4285F4" stroke="#FFFFFF" stroke-width="2"/>
    </svg>
  `
  return L.divIcon({
    html: `<div class="blue-dot-pulse">${svg}</div>`,
    className: 'blue-dot-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

// Component to handle map settings and user location
function MapController({ userLocation, setUserLocation }) {
  const map = useMap()
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
        },
        (error) => {
          console.log('Geolocation error:', error.message)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }, [setUserLocation])
  
  // Disable scroll wheel zoom (page scrolls instead)
  useEffect(() => {
    map.scrollWheelZoom.disable()
    
    // Enable scroll zoom only with Ctrl key
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        map.scrollWheelZoom.enable()
      } else {
        map.scrollWheelZoom.disable()
      }
    }
    
    map.getContainer().addEventListener('wheel', handleWheel)
    return () => {
      map.getContainer().removeEventListener('wheel', handleWheel)
    }
  }, [map])
  
  return null
}

// Fullscreen control component
function FullscreenControl({ isFullscreen, toggleFullscreen }) {
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <div className="leaflet-control">
        <button
          onClick={toggleFullscreen}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
    </div>
  )
}

// Map type toggle component
function MapTypeControl({ mapType, setMapType }) {
  return (
    <div className="leaflet-bottom leaflet-left" style={{ marginBottom: '25px', marginLeft: '10px' }}>
      <div className="leaflet-control">
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => setMapType('street')}
            className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
              mapType === 'street' 
                ? 'bg-saudi-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Map size={16} />
            <span>Map</span>
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
              mapType === 'satellite' 
                ? 'bg-saudi-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Satellite size={16} />
            <span>Satellite</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// My Location button component
function MyLocationControl({ userLocation, map }) {
  const goToMyLocation = () => {
    if (userLocation && map) {
      map.flyTo(userLocation, 15, { duration: 1 })
    }
  }
  
  if (!userLocation) return null
  
  return (
    <div className="leaflet-bottom leaflet-right" style={{ marginBottom: '25px', marginRight: '10px' }}>
      <div className="leaflet-control">
        <button
          onClick={goToMyLocation}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          title="My Location"
        >
          <Navigation size={20} className="text-blue-500" />
        </button>
      </div>
    </div>
  )
}

function MapView({ language, locations, banks, selectedLocation, setSelectedLocation }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapType, setMapType] = useState('street')
  const [userLocation, setUserLocation] = useState(null)
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  
  // Default center: Riyadh
  const defaultCenter = [24.7136, 46.6753]
  const defaultZoom = 11
  
  // Tile layers
  const tileLayers = {
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  }
  
  // Get bank code from bank_id
  const getBankCode = (bankId) => {
    const bank = banks.find(b => b.id === bankId)
    return bank?.code || 'default'
  }
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* CSS for blue dot pulse animation */}
      <style>{`
        .blue-dot-icon {
          background: transparent !important;
          border: none !important;
        }
        .blue-dot-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .custom-pin-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          font-family: 'Tajawal', 'Poppins', sans-serif;
        }
      `}</style>
      
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        ref={mapRef}
      >
        {/* Map Controller */}
        <MapController 
          userLocation={userLocation} 
          setUserLocation={setUserLocation} 
        />
        
        {/* Zoom Control - Top Left */}
        <ZoomControl position="topleft" />
        
        {/* Tile Layer */}
        <TileLayer
          key={mapType}
          url={tileLayers[mapType]}
          attribution={mapType === 'street' 
            ? '&copy; OpenStreetMap contributors' 
            : '&copy; Esri'
          }
        />
        
        {/* User Location Blue Dot */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={createBlueDotIcon()}
          >
            <Popup>
              {language === 'ar' ? 'موقعك الحالي' : 'Your Location'}
            </Popup>
          </Marker>
        )}
        
        {/* Location Markers */}
        {locations.map(location => {
          if (!location.latitude || !location.longitude) return null
          
          const bankCode = getBankCode(location.bank_id)
          const color = BANK_COLORS[bankCode] || '#6B7280'
          
          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={createPinIcon(color)}
              eventHandlers={{
                click: () => setSelectedLocation(location)
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{language === 'ar' ? location.name_ar : location.name_en}</p>
                  <p className="text-gray-600">{language === 'ar' ? location.address_ar : location.address_en}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
        
        {/* Fullscreen Control */}
        <FullscreenControl 
          isFullscreen={isFullscreen} 
          toggleFullscreen={toggleFullscreen} 
        />
        
        {/* Map Type Control */}
        <MapTypeControl 
          mapType={mapType} 
          setMapType={setMapType} 
        />
        
        {/* My Location Control */}
        <MyLocationControl 
          userLocation={userLocation} 
          map={mapRef.current} 
        />
      </MapContainer>
    </div>
  )
}

export default MapView
