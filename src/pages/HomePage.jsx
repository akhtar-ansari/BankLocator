import React, { useState, useEffect } from 'react'
import StoriesCarousel from '../components/StoriesCarousel'
import FilterSidebar from '../components/FilterSidebar'
import MapView from '../components/MapView'
import LocationCard from '../components/LocationCard'
import { banksAPI, citiesAPI, locationsAPI } from '../lib/supabase'
import { Menu, X } from 'lucide-react'

function HomePage({ language, openComingSoon }) {
  const [banks, setBanks] = useState([])
  const [cities, setCities] = useState([])
  const [locations, setLocations] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    type: 'both',
    bankIds: [],
    cityId: null,
    is24Hours: false
  })
  
  useEffect(() => {
    loadInitialData()
  }, [])
  
  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [banksData, citiesData, locationsData] = await Promise.all([
        banksAPI.getAll(),
        citiesAPI.getAll(),
        locationsAPI.getAll()
      ])
      setBanks(banksData || [])
      setCities(citiesData || [])
      setLocations(locationsData || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleApplyFilters = async () => {
    try {
      setLoading(true)
      const data = await locationsAPI.getFiltered(filters)
      setLocations(data || [])
      setShowFilters(false)
    } catch (err) {
      console.error('Error filtering:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const t = {
    ar: {
      loading: 'جاري التحميل...',
      filters: 'الفلاتر',
      locationsCount: 'موقع',
      news: 'آخر الأخبار'
    },
    en: {
      loading: 'Loading...',
      filters: 'Filters',
      locationsCount: 'locations',
      news: 'Latest News'
    }
  }
  
  const text = t[language]
  
  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border"
          >
            <Menu size={18} />
            <span>{text.filters}</span>
          </button>
          <span className="text-sm text-gray-500">
            {locations.length} {text.locationsCount}
          </span>
        </div>
        
        {/* Desktop Layout: Left Panel (Carousel + Filters) + Map */}
        <div className="flex gap-4">
          
          {/* Left Panel - Desktop */}
          <div className="hidden md:flex flex-col gap-4 w-80 flex-shrink-0">
            {/* Stories Carousel - Above Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{text.news}</h3>
              <StoriesCarousel language={language} />
            </div>
            
            {/* Filter Sidebar */}
            <FilterSidebar
              language={language}
              banks={banks}
              cities={cities}
              filters={filters}
              setFilters={setFilters}
              onApply={handleApplyFilters}
            />
          </div>
          
          {/* Map */}
          <div className="flex-1 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-saudi-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">{text.loading}</p>
                </div>
              </div>
            )}
            
            <MapView
              language={language}
              locations={locations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          </div>
          
          {/* Selected Location Card - Desktop */}
          {selectedLocation && (
            <div className="hidden md:block w-80 flex-shrink-0">
              <LocationCard
                location={selectedLocation}
                language={language}
                onClose={() => setSelectedLocation(null)}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
              <h2 className="font-bold">{text.filters}</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              {/* Mobile Carousel */}
              <div className="mb-4">
                <StoriesCarousel language={language} />
              </div>
              <FilterSidebar
                language={language}
                banks={banks}
                cities={cities}
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Location Card - Bottom Sheet */}
      {selectedLocation && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4">
          <LocationCard
            location={selectedLocation}
            language={language}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}
    </div>
  )
}

export default HomePage
