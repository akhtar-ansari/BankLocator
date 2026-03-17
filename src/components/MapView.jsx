import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Navigation, Phone, Clock, ExternalLink, AlertTriangle } from 'lucide-react'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

// Create custom bank marker icon
const createBankIcon = (color = '#006B3F', type = 'branch') => {
  const size = type === 'atm' ? 24 : 32
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      ${type === 'atm' 
        ? '<text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">ATM</text>'
        : '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="1.5" fill="none"/>'
      }
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  })
}

// Component to handle map center updates
function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 12)
    }
  }, [center, zoom, map])
  return null
}

// Near Me Button Handler
function NearMeButton({ language, onLocate }) {
  const [loading, setLoading] = useState(false)
  
  const handleClick = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocate([position.coords.latitude, position.coords.longitude])
          setLoading(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          setLoading(false)
          alert(language === 'ar' 
            ? 'تعذر تحديد موقعك. يرجى السماح بالوصول للموقع.'
            : 'Could not get your location. Please allow location access.'
          )
        }
      )
    }
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="absolute top-4 right-4 z-[1000] flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-dark font-medium rounded-full shadow-lg transition-colors pulse-gold"
    >
      <Navigation size={18} className={loading ? 'animate-spin' : ''} />
      <span>{language === 'ar' ? 'موقعي' : 'Near Me'}</span>
    </button>
  )
}

function MapView({ language, locations = [], selectedLocation, setSelectedLocation }) {
  const [center, setCenter] = useState([24.7136, 46.6753]) // Riyadh default
  const [zoom, setZoom] = useState(11)
  
  const handleNearMe = (coords) => {
    setCenter(coords)
    setZoom(14)
  }
  
  const t = {
    ar: {
      open: 'مفتوح',
      closed: 'مغلق',
      hours: 'ساعات العمل',
      directions: 'الاتجاهات',
      call: 'اتصل',
      openAccount: 'افتح حساب',
      reportUpdate: 'أبلغ عن تحديث',
      noLocations: 'لا توجد مواقع',
      noLocationsDesc: 'جرب تغيير الفلاتر أو اختيار مدينة أخرى'
    },
    en: {
      open: 'Open',
      closed: 'Closed',
      hours: 'Hours',
      directions: 'Directions',
      call: 'Call',
      openAccount: 'Open Account',
      reportUpdate: 'Report Update',
      noLocations: 'No locations found',
      noLocationsDesc: 'Try changing filters or selecting a different city'
    }
  }
  
  const text = t[language]
  
  // Check if branch is currently open
  const isOpen = (location) => {
    if (location.is_24_hours) return true
    
    const now = new Date()
    const day = now.getDay() // 0 = Sunday
    
    // Saudi working days: Sunday (0) to Thursday (4)
    if (day === 5 || day === 6) return false // Friday, Saturday closed
    
    const currentTime = now.getHours() * 100 + now.getMinutes()
    const openTime = 930 // 9:30 AM
    const closeTime = 1630 // 4:30 PM
    
    return currentTime >= openTime && currentTime <= closeTime
  }
  
  return (
    <div className="relative flex-1 h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} zoom={zoom} />
        
        {locations.map(location => (
          location.latitude && location.longitude && (
            <Marker
              key={location.id}
              position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
              icon={createBankIcon(
                location.banks?.brand_color || '#006B3F',
                location.type
              )}
              eventHandlers={{
                click: () => setSelectedLocation(location)
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  {/* Bank Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: location.banks?.brand_color || '#006B3F' }}
                    />
                    <span className="font-bold text-sm">
                      {language === 'ar' ? location.banks?.name_ar : location.banks?.name_en}
                    </span>
                  </div>
                  
                  {/* Branch Name */}
                  <p className="text-sm text-gray-700 mb-2">
                    {language === 'ar' ? location.name_ar : location.name_en}
                  </p>
                  
                  {/* Status */}
                  <div className="flex items-center gap-2 mb-2">
                    {location.is_24_hours ? (
                      <span className="status-open">24/7</span>
                    ) : isOpen(location) ? (
                      <span className="status-open">{text.open}</span>
                    ) : (
                      <span className="status-closed">{text.closed}</span>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    {location.google_maps_url && (
                      <a
                        href={location.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-saudi-green-500 hover:underline"
                      >
                        <Navigation size={12} />
                        {text.directions}
                      </a>
                    )}
                    {location.phone && (
                      <a
                        href={`tel:${location.phone}`}
                        className="flex items-center gap-1 text-xs text-saudi-green-500 hover:underline"
                      >
                        <Phone size={12} />
                        {text.call}
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      
      {/* Near Me Button */}
      <NearMeButton language={language} onLocate={handleNearMe} />
      
      {/* No Locations Message */}
      {locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[500]">
          <div className="text-center p-6">
            <AlertTriangle size={48} className="text-gold-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-dark mb-2">{text.noLocations}</h3>
            <p className="text-gray-600 text-sm">{text.noLocationsDesc}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView
