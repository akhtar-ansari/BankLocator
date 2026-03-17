import React, { useState, useEffect } from 'react'
import FilterBar from '../components/FilterBar'
import MapView from '../components/MapView'
import LocationCard from '../components/LocationCard'
import { banksAPI, citiesAPI, locationsAPI } from '../lib/supabase'

function HomePage({ language, openComingSoon }) {
  const [banks, setBanks] = useState([])
  const [cities, setCities] = useState([])
  const [locations, setLocations] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    type: 'both',
    bankIds: [],
    cityId: null,
    is24Hours: false,
    wheelchair: false,
    womenSection: false,
    driveThru: false,
    foreignExchange: false
  })
  
  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])
  
  // Apply filters whenever filters change (instant filtering)
  useEffect(() => {
    applyFilters()
  }, [filters, locations])
  
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
      setFilteredLocations(locationsData || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const applyFilters = () => {
    let result = [...locations]
    
    // Filter by bank
    if (filters.bankIds.length > 0) {
      result = result.filter(loc => filters.bankIds.includes(loc.bank_id))
    }
    
    // Filter by type
    if (filters.type === 'branch') {
      result = result.filter(loc => loc.type === 'branch' || loc.type === 'both')
    } else if (filters.type === 'atm') {
      result = result.filter(loc => loc.type === 'atm' || loc.type === 'both')
    }
    
    // Filter by city
    if (filters.cityId) {
      result = result.filter(loc => loc.city_id === filters.cityId)
    }
    
    // Filter by services
    if (filters.is24Hours) {
      result = result.filter(loc => loc.is_24_hours === true)
    }
    if (filters.wheelchair) {
      result = result.filter(loc => loc.wheelchair_accessible === true)
    }
    if (filters.womenSection) {
      result = result.filter(loc => loc.women_section === true)
    }
    if (filters.driveThru) {
      result = result.filter(loc => loc.drive_thru === true)
    }
    if (filters.foreignExchange) {
      result = result.filter(loc => loc.foreign_exchange === true)
    }
    
    setFilteredLocations(result)
  }
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // Filtering happens automatically via useEffect
  }
  
  const t = {
    ar: {
      loading: 'جاري التحميل...',
      locationsCount: 'موقع',
      noResults: 'لا توجد نتائج'
    },
    en: {
      loading: 'Loading...',
      locationsCount: 'locations',
      noResults: 'No results found'
    }
  }
  
  const text = t[language]
  
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
      
      {/* Filter Bar - Above Map */}
      <FilterBar
        language={language}
        banks={banks}
        cities={cities}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {/* Results Count */}
      <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
        {loading ? text.loading : `${filteredLocations.length} ${text.locationsCount}`}
      </div>
      
      {/* Map - Full Width */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-saudi-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">{text.loading}</p>
            </div>
          </div>
        )}
        
        {!loading && filteredLocations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <p className="text-gray-500">{text.noResults}</p>
          </div>
        )}
        
        <MapView
          language={language}
          locations={filteredLocations}
          banks={banks}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </div>
      
      {/* Selected Location Card - Bottom Sheet on Mobile, Side Panel on Desktop */}
      {selectedLocation && (
        <>
          {/* Desktop - Side Panel */}
          <div className="hidden md:block fixed top-20 right-4 w-80 z-40">
            <LocationCard
              location={selectedLocation}
              language={language}
              onClose={() => setSelectedLocation(null)}
            />
          </div>
          
          {/* Mobile - Bottom Sheet */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4">
            <LocationCard
              location={selectedLocation}
              language={language}
              onClose={() => setSelectedLocation(null)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
