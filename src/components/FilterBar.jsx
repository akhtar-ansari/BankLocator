import React from 'react'
import { X } from 'lucide-react'

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

function FilterBar({ language, banks, cities, filters, onFilterChange }) {
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
      allServices: 'جميع الخدمات',
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
      allServices: 'All Services',
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
  
  // Toggle bank selection
  const toggleBank = (bankId) => {
    const newBankIds = filters.bankIds.includes(bankId)
      ? filters.bankIds.filter(id => id !== bankId)
      : [...filters.bankIds, bankId]
    onFilterChange({ ...filters, bankIds: newBankIds })
  }
  
  // Clear all bank selections
  const clearBanks = () => {
    onFilterChange({ ...filters, bankIds: [] })
  }
  
  // Change location type
  const setType = (type) => {
    onFilterChange({ ...filters, type })
  }
  
  // Change city
  const setCity = (cityId) => {
    onFilterChange({ ...filters, cityId: cityId || null })
  }
  
  // Toggle service
  const toggleService = (serviceKey) => {
    onFilterChange({ 
      ...filters, 
      [serviceKey]: !filters[serviceKey] 
    })
  }
  
  // Clear all services
  const clearServices = () => {
    onFilterChange({ 
      ...filters, 
      is24Hours: false,
      wheelchair: false,
      womenSection: false,
      driveThru: false,
      foreignExchange: false
    })
  }
  
  // Clear everything
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
  
  return (
    <div className="bg-white border-b shadow-sm">
      {/* Row 1: Bank Pills */}
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
                  backgroundColor: isSelected ? color : '#F3F4F6',
                  color: isSelected ? '#FFFFFF' : '#374151',
                  border: `2px solid ${isSelected ? color : '#E5E7EB'}`
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
      
      {/* Row 2: Type + City + Services */}
      <div className="px-4 py-3 flex items-center gap-4 flex-wrap">
        
        {/* Type: Branch / ATM / Both */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">{text.type}:</span>
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
        </div>
        
        {/* City Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">{text.city}:</span>
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
        </div>
        
        {/* Services Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">{text.services}:</span>
          <div className="relative group">
            <button className="px-3 py-1.5 text-sm border rounded-lg bg-white hover:bg-gray-50 flex items-center gap-2">
              <span>{text.allServices}</span>
              <span className="text-xs text-gray-400">▼</span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[180px]">
              {serviceOptions.map(service => (
                <label
                  key={service.key}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters[service.key] || false}
                    onChange={() => toggleService(service.key)}
                    className="w-4 h-4 text-saudi-green-500 rounded focus:ring-saudi-green-500"
                  />
                  <span className="text-sm">{service.label}</span>
                </label>
              ))}
              
              <div className="border-t px-3 py-2">
                <button
                  onClick={clearServices}
                  className="text-xs text-red-600 hover:underline"
                >
                  {text.clearAll}
                </button>
              </div>
            </div>
          </div>
        </div>
        
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
    </div>
  )
}

export default FilterBar
