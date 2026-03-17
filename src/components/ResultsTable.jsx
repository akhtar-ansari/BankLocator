import React from 'react'
import { MapPin, Clock, Phone, Navigation, CheckCircle, XCircle } from 'lucide-react'

// Bank colors (same as FilterBar)
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

function ResultsTable({ language, locations, banks, cities, onRowClick, selectedLocationId }) {
  const t = {
    ar: {
      bank: 'البنك',
      branchName: 'اسم الفرع',
      type: 'النوع',
      city: 'المدينة',
      timing: 'التوقيت',
      workingDays: 'أيام العمل',
      status: 'الحالة',
      services: 'الخدمات',
      actions: 'إجراءات',
      branch: 'فرع',
      atm: 'صراف',
      both: 'فرع + صراف',
      open: 'مفتوح',
      closed: 'مغلق',
      open24: '24 ساعة',
      sunThu: 'الأحد - الخميس',
      noResults: 'لا توجد نتائج',
      directions: 'الاتجاهات',
      wheelchair: 'كرسي متحرك',
      womenSection: 'قسم نسائي',
      driveThru: 'سيارات',
      foreignExchange: 'صرف عملات'
    },
    en: {
      bank: 'Bank',
      branchName: 'Branch Name',
      type: 'Type',
      city: 'City',
      timing: 'Timing',
      workingDays: 'Working Days',
      status: 'Status',
      services: 'Services',
      actions: 'Actions',
      branch: 'Branch',
      atm: 'ATM',
      both: 'Branch + ATM',
      open: 'Open',
      closed: 'Closed',
      open24: '24 Hours',
      sunThu: 'Sun - Thu',
      noResults: 'No results found',
      directions: 'Directions',
      wheelchair: 'Wheelchair',
      womenSection: 'Women',
      driveThru: 'Drive-thru',
      foreignExchange: 'Exchange'
    }
  }
  
  const text = t[language]
  
  // Get bank info
  const getBank = (bankId) => banks.find(b => b.id === bankId)
  
  // Get city info
  const getCity = (cityId) => cities.find(c => c.id === cityId)
  
  // Get type label
  const getTypeLabel = (type) => {
    if (type === 'branch') return text.branch
    if (type === 'atm') return text.atm
    return text.both
  }
  
  // Check if currently open (simplified - assumes 9 AM - 4 PM Sun-Thu)
  const isCurrentlyOpen = (location) => {
    if (location.is_24_hours) return true
    
    const now = new Date()
    const day = now.getDay() // 0 = Sunday
    const hour = now.getHours()
    
    // Closed on Friday (5) and Saturday (6)
    if (day === 5 || day === 6) return false
    
    // Open 9 AM - 4 PM
    return hour >= 9 && hour < 16
  }
  
  // Get services list
  const getServices = (location) => {
    const services = []
    if (location.is_24_hours) services.push(text.open24)
    if (location.wheelchair_accessible) services.push(text.wheelchair)
    if (location.women_section) services.push(text.womenSection)
    if (location.drive_thru) services.push(text.driveThru)
    if (location.foreign_exchange) services.push(text.foreignExchange)
    return services
  }
  
  // Open directions
  const openDirections = (location, e) => {
    e.stopPropagation()
    const url = `https://maps.google.com/?q=${location.latitude},${location.longitude}`
    window.open(url, '_blank')
  }
  
  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p>{text.noResults}</p>
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <div className="max-h-[50vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.bank}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.branchName}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.type}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.city}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.timing}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.workingDays}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.status}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.services}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{text.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {locations.map(location => {
              const bank = getBank(location.bank_id)
              const city = getCity(location.city_id)
              const bankCode = bank?.code || 'default'
              const color = BANK_COLORS[bankCode] || '#6B7280'
              const isOpen = isCurrentlyOpen(location)
              const services = getServices(location)
              const isSelected = selectedLocationId === location.id
              
              return (
                <tr
                  key={location.id}
                  onClick={() => onRowClick(location)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    isSelected ? 'bg-saudi-green-50 border-l-4 border-saudi-green-500' : ''
                  }`}
                >
                  {/* Bank */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-gray-800">
                        {language === 'ar' ? bank?.name_ar : bank?.name_en}
                      </span>
                    </div>
                  </td>
                  
                  {/* Branch Name */}
                  <td className="px-3 py-2">
                    <span className="text-gray-700">
                      {language === 'ar' ? location.name_ar : location.name_en}
                    </span>
                  </td>
                  
                  {/* Type */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      location.type === 'branch' 
                        ? 'bg-blue-100 text-blue-700'
                        : location.type === 'atm'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {getTypeLabel(location.type)}
                    </span>
                  </td>
                  
                  {/* City */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                    {language === 'ar' ? city?.name_ar : city?.name_en}
                  </td>
                  
                  {/* Timing */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                    {location.is_24_hours ? (
                      <span className="text-green-600 font-medium">{text.open24}</span>
                    ) : (
                      location.working_hours || '9:00 AM - 4:00 PM'
                    )}
                  </td>
                  
                  {/* Working Days */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                    {location.working_days || text.sunThu}
                  </td>
                  
                  {/* Status */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {isOpen ? (
                        <>
                          <CheckCircle size={14} className="text-green-500" />
                          <span className="text-green-600 font-medium">{text.open}</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className="text-red-500" />
                          <span className="text-red-600 font-medium">{text.closed}</span>
                        </>
                      )}
                    </div>
                  </td>
                  
                  {/* Services */}
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {services.length > 0 ? (
                        services.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      {services.length > 3 && (
                        <span className="text-xs text-gray-400">+{services.length - 3}</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={(e) => openDirections(location, e)}
                      className="flex items-center gap-1 px-2 py-1 bg-saudi-green-500 text-white text-xs rounded hover:bg-saudi-green-600 transition-colors"
                    >
                      <Navigation size={12} />
                      <span>{text.directions}</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultsTable
