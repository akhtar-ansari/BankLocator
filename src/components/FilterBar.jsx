import React from 'react'
import { X, Navigation } from 'lucide-react'

// Unique colors for each bank (visually distinct)
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

function FilterBar({ language, banks, cities, filters, onFilterChange, onNearMe }) {
  const t = {
    ar: {
      allBanks: 'جميع البنوك',
      clearAll: 'مسح الكل',
      type: 'النوع',
      branch: 'فرع',
      atm: 'صراف',
      both: 'الكل',
      city: 'المدينة',
      allCities: 'جميع المدن',
      services: 'الخدمات',
      nearMe: 'قريب مني',
      is24Hours: '24 ساعة',
      wheelchair: 'كرسي متحرك',
      womenSection: 'قسم نسائي',
      driveThru: 'خدمة السيارات',
      foreignExchange: 'صرف عملات'
    },
    en: {
      allBanks: 'All Banks',
      clearAll: 'Clear All',
      type: 'Type',
      branch: 'Branch',
      atm: 'ATM',
      both: 'Both',
      city: 'City',
      allCities: 'All Cities',
      services: 'Services',
      nearMe: 'Near Me',
      is24Hours: '24 Hours',
      wheelchair: 'Wheelchair',
      womenSection: 'Women Section',
      driveThru: 'Drive-thru',
      foreignExchange: 'Foreign Exchange'
    }
  }
  
  const text = t[language]
  
  const serviceOptions = [
    { key: 'is24Hours', label: text.is24Hours },
    { key: 'wheelchair', label: text.wheelchair },
    { key: 'womenSection', label: text.womenSection },
    { key: 'driveThru', label: text.driveThru },
    { key: 'foreignExchange', label: text.foreignExchange }
  ]
  
  const toggleBank = (bankId) => {
    const newBankIds = filters.bankIds.includes(bankId)
      ? filters.bankIds.filter(id => id !== bankId)
      : [...filters.bankIds, bankId]
    onFilterChange({ ...filters, bankIds: newBankIds })
  }
  
  const clearBanks = () => {
    onFilterChange({ ...filters, bankIds: [] })
  }
  
  const setType = (type) => {
    onFilterChange({ ...filters, type })
  }
  
  const setCity = (cityId) => {
    onFilterChange({ ...filters, cityId: cityId || null })
  }
  
  const toggleService = (serviceKey) => {
    onFilterChange({ 
      ...filters, 
      [serviceKey]: !filters[serviceKey] 
    })
  }
  
  const clearAll = () => {
    onFilterChange({
      type: 'both',
      bankIds: [],
      cityId: null,
      is24Hours: false,
      wheelchair: false,
      womenSection: false,
      driveThru: false,
      foreignExchange: false
    })
  }
  
  const hasActiveFilters = filters.bankIds.length > 0 || 
    filters.cityId || 
    filters.type !== 'both' ||
    filters.is24Hours ||
    filters.wheelchair ||
    filters.womenSection ||
    filters.driveThru ||
    filters.foreignExchange
  
  const activeServicesCount = serviceOptions.filter(s => filters[s.key]).length
  
  return (
    <div className="bg-white border-b shadow-sm sticky top-16 z-30">
      
      {/* Row 1: Bank Pills - Wrapping */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center gap-2 flex-wrap">
          {banks.map(bank => {
            const isSelected = filters.bankIds.includes(bank.id)
            const color = BANK_COLORS[bank.code] || '#6B7280'
            
            return (
              <button
                key={bank.id}
                onClick={() => toggleBank(bank.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: isSelected ? color : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : color,
                  border: `2px solid ${color}`
                }}
              >
                {bank.logo_url && (
                  <img 
                    src={bank.logo_url} 
                    alt="" 
                    className="w-4 h-4 rounded-full object-contain"
                    style={{ filter: isSelected ? 'brightness(10)' : 'none' }}
                  />
                )}
                <span>{language === 'ar' ? bank.name_ar : bank.name_en}</span>
              </button>
            )
          })}
          
          {filters.bankIds.length > 0 && (
            <button
              onClick={clearBanks}
              className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={12} />
              <span>{text.clearAll}</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Row 2: Type + City + Near Me + Clear All */}
      <div className="px-4 py-2 flex items-center gap-3 flex-wrap border-b">
        
        {/* Type: Branch / ATM / Both */}
        <div className="flex rounded-lg overflow-hidden border">
          {['branch', 'atm', 'both'].map(type => (
            <button
              key={type}
              onClick={() => setType(type)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                filters.type === type
                  ? 'bg-saudi-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {text[type]}
            </button>
          ))}
        </div>
        
        {/* City Dropdown */}
        <select
          value={filters.cityId || ''}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-saudi-green-500"
        >
          <option value="">{text.allCities}</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {language === 'ar' ? city.name_ar : city.name_en}
            </option>
          ))}
        </select>
        
        {/* Near Me Button */}
        <button
          onClick={onNearMe}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Navigation size={14} />
          <span>{text.nearMe}</span>
        </button>
        
        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
          >
            <X size={14} />
            <span>{text.clearAll}</span>
          </button>
        )}
      </div>
      
      {/* Row 3: Services Chips */}
      <div className="px-4 py-2 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">{text.services}:</span>
        
        {serviceOptions.map(service => {
          const isActive = filters[service.key]
          return (
            <button
              key={service.key}
              onClick={() => toggleService(service.key)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                isActive
                  ? 'bg-saudi-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {service.label}
            </button>
          )
        })}
        
        {activeServicesCount > 0 && (
          <span className="text-xs text-gray-400 ml-2">
            ({activeServicesCount})
          </span>
        )}
      </div>
    </div>
  )
}

export default FilterBar
