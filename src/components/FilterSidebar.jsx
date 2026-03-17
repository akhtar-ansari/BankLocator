import React from 'react'
import { Building2, Banknote, MapPin, Clock } from 'lucide-react'

function FilterSidebar({ 
  language, 
  banks = [], 
  cities = [],
  filters, 
  setFilters,
  onApply 
}) {
  const t = {
    ar: {
      type: 'النوع',
      branches: 'الفروع',
      atms: 'الصرافات',
      both: 'الكل',
      selectBank: 'اختر البنك',
      allBanks: 'جميع البنوك',
      selectCity: 'المدينة',
      allCities: 'جميع المدن',
      services: 'الخدمات',
      is24Hours: 'يعمل 24 ساعة',
      apply: 'تطبيق',
      reset: 'إعادة ضبط'
    },
    en: {
      type: 'Type',
      branches: 'Branches',
      atms: 'ATMs',
      both: 'Both',
      selectBank: 'Select Bank',
      allBanks: 'All Banks',
      selectCity: 'City',
      allCities: 'All Cities',
      services: 'Services',
      is24Hours: '24 Hours',
      apply: 'Apply',
      reset: 'Reset'
    }
  }
  
  const text = t[language]
  
  const handleTypeChange = (type) => {
    setFilters(prev => ({ ...prev, type }))
  }
  
  const handleBankToggle = (bankId) => {
    setFilters(prev => {
      const selected = prev.bankIds || []
      if (selected.includes(bankId)) {
        return { ...prev, bankIds: selected.filter(id => id !== bankId) }
      }
      return { ...prev, bankIds: [...selected, bankId] }
    })
  }
  
  const handleCityChange = (cityId) => {
    setFilters(prev => ({ ...prev, cityId: cityId || null }))
  }
  
  const handle24HoursToggle = () => {
    setFilters(prev => ({ ...prev, is24Hours: !prev.is24Hours }))
  }
  
  const handleReset = () => {
    setFilters({
      type: 'both',
      bankIds: [],
      cityId: null,
      is24Hours: false
    })
  }
  
  return (
    <aside className="filter-sidebar w-full md:w-80 bg-white rounded-xl shadow-lg p-4 space-y-6">
      
      {/* Type Toggle */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {text.type}
        </label>
        <div className="flex rounded-lg bg-gray-100 p-1">
          {['branches', 'atms', 'both'].map(type => (
            <button
              key={type}
              onClick={() => handleTypeChange(type === 'branches' ? 'branch' : type === 'atms' ? 'atm' : 'both')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                (filters.type === 'branch' && type === 'branches') ||
                (filters.type === 'atm' && type === 'atms') ||
                (filters.type === 'both' && type === 'both')
                  ? 'bg-saudi-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'branches' && <Building2 size={14} className="inline mr-1" />}
              {type === 'atms' && <Banknote size={14} className="inline mr-1" />}
              {text[type]}
            </button>
          ))}
        </div>
      </div>
      
      {/* Banks Multi-Select */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {text.selectBank}
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
          {banks.map(bank => (
            <label 
              key={bank.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(filters.bankIds || []).includes(bank.id)}
                onChange={() => handleBankToggle(bank.id)}
                className="w-4 h-4 text-saudi-green-500 rounded focus:ring-saudi-green-500"
              />
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: bank.brand_color || '#006B3F' }}
              />
              <span className="text-sm text-gray-700">
                {language === 'ar' ? bank.name_ar : bank.name_en}
              </span>
            </label>
          ))}
          {banks.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </p>
          )}
        </div>
      </div>
      
      {/* City Select */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          <MapPin size={14} className="inline mr-1" />
          {text.selectCity}
        </label>
        <select
          value={filters.cityId || ''}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-saudi-green-500 focus:border-saudi-green-500"
        >
          <option value="">{text.allCities}</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {language === 'ar' ? city.name_ar : city.name_en}
            </option>
          ))}
        </select>
      </div>
      
      {/* 24 Hours Toggle */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {text.services}
        </label>
        <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.is24Hours}
            onChange={handle24HoursToggle}
            className="w-4 h-4 text-saudi-green-500 rounded focus:ring-saudi-green-500"
          />
          <Clock size={18} className="text-gold-500" />
          <span className="text-sm text-gray-700">{text.is24Hours}</span>
        </label>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onApply}
          className="flex-1 btn-primary"
        >
          {text.apply}
        </button>
        <button
          onClick={handleReset}
          className="btn-outline px-4"
        >
          {text.reset}
        </button>
      </div>
    </aside>
  )
}

export default FilterSidebar
