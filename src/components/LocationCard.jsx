import React from 'react'
import { X, Navigation, Phone, Clock, ExternalLink, Flag, Building2, Banknote } from 'lucide-react'

function LocationCard({ location, language, onClose }) {
  if (!location) return null
  
  const t = {
    ar: {
      open: 'مفتوح الآن',
      closed: 'مغلق',
      open24: 'يعمل 24 ساعة',
      hours: 'ساعات العمل',
      address: 'العنوان',
      phone: 'الهاتف',
      directions: 'احصل على الاتجاهات',
      call: 'اتصل',
      openAccount: 'افتح حساب',
      reportUpdate: 'أبلغ عن تحديث',
      branch: 'فرع',
      atm: 'صراف آلي',
      remittance: 'مركز تحويل',
      islamic: 'إسلامي',
      lastUpdated: 'آخر تحديث'
    },
    en: {
      open: 'Open Now',
      closed: 'Closed',
      open24: 'Open 24 Hours',
      hours: 'Working Hours',
      address: 'Address',
      phone: 'Phone',
      directions: 'Get Directions',
      call: 'Call',
      openAccount: 'Open Account',
      reportUpdate: 'Report Update',
      branch: 'Branch',
      atm: 'ATM',
      remittance: 'Remittance Center',
      islamic: 'Islamic',
      lastUpdated: 'Last updated'
    }
  }
  
  const text = t[language]
  
  // Check if branch is currently open
  const isOpen = () => {
    if (location.is_24_hours) return true
    
    const now = new Date()
    const day = now.getDay()
    
    if (day === 5 || day === 6) return false
    
    const currentTime = now.getHours() * 100 + now.getMinutes()
    const openTime = 930
    const closeTime = 1630
    
    return currentTime >= openTime && currentTime <= closeTime
  }
  
  const getTypeIcon = () => {
    switch (location.type) {
      case 'atm': return <Banknote size={18} />
      case 'remittance_center': return <Building2 size={18} />
      default: return <Building2 size={18} />
    }
  }
  
  const getTypeName = () => {
    switch (location.type) {
      case 'atm': return text.atm
      case 'remittance_center': return text.remittance
      default: return text.branch
    }
  }
  
  // Build Google Maps URL if not present
  const getDirectionsUrl = () => {
    if (location.google_maps_url) return location.google_maps_url
    if (location.latitude && location.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`
    }
    return null
  }
  
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-slide-up">
      {/* Header with Bank Color */}
      <div 
        className="p-4 text-white"
        style={{ backgroundColor: location.banks?.brand_color || '#006B3F' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Bank Logo Placeholder */}
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              {getTypeIcon()}
            </div>
            <div>
              <h3 className="font-bold">
                {language === 'ar' ? location.banks?.name_ar : location.banks?.name_en}
              </h3>
              <p className="text-sm opacity-90">
                {language === 'ar' ? location.name_ar : location.name_en}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Type & Status Badges */}
        <div className="flex items-center gap-2 mt-3">
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
            {getTypeName()}
          </span>
          {location.is_islamic && (
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
              {text.islamic}
            </span>
          )}
          {location.is_24_hours ? (
            <span className="px-2 py-1 bg-green-500 rounded-full text-xs">
              {text.open24}
            </span>
          ) : isOpen() ? (
            <span className="px-2 py-1 bg-green-500 rounded-full text-xs">
              {text.open}
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-500 rounded-full text-xs">
              {text.closed}
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Address */}
        <div className="flex gap-3">
          <Navigation size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 mb-1">{text.address}</p>
            <p className="text-sm text-gray-700">
              {language === 'ar' ? location.address_ar : location.address_en}
              {location.cities && (
                <span className="text-gray-500">
                  {' - '}{language === 'ar' ? location.cities.name_ar : location.cities.name_en}
                </span>
              )}
            </p>
          </div>
        </div>
        
        {/* Hours */}
        {!location.is_24_hours && (
          <div className="flex gap-3">
            <Clock size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">{text.hours}</p>
              <p className="text-sm text-gray-700">
                {language === 'ar' ? 'الأحد - الخميس: ٩:٣٠ ص - ٤:٣٠ م' : 'Sun - Thu: 9:30 AM - 4:30 PM'}
              </p>
            </div>
          </div>
        )}
        
        {/* Phone */}
        {location.phone && (
          <div className="flex gap-3">
            <Phone size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">{text.phone}</p>
              <a 
                href={`tel:${location.phone}`}
                className="text-sm text-saudi-green-500 hover:underline"
              >
                {location.phone}
              </a>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {getDirectionsUrl() && (
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Navigation size={16} />
              {text.directions}
            </a>
          )}
          {location.phone && (
            <a
              href={`tel:${location.phone}`}
              className="btn-outline flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              {text.call}
            </a>
          )}
        </div>
        
        {/* Secondary Actions */}
        <div className="flex gap-2">
          {location.banks?.website_url && (
            <a
              href={location.banks.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 text-sm text-saudi-green-500 hover:bg-saudi-green-50 rounded-lg transition-colors"
            >
              <ExternalLink size={14} className="inline mr-1" />
              {text.openAccount}
            </a>
          )}
          <button
            className="flex-1 text-center py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => {
              // TODO: Implement report form
              alert(language === 'ar' ? 'شكراً! سيتم مراجعة بلاغك.' : 'Thanks! Your report will be reviewed.')
            }}
          >
            <Flag size={14} className="inline mr-1" />
            {text.reportUpdate}
          </button>
        </div>
        
        {/* Last Updated */}
        {location.last_verified && (
          <p className="text-xs text-gray-400 text-center">
            {text.lastUpdated}: {new Date(location.last_verified).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
          </p>
        )}
      </div>
    </div>
  )
}

export default LocationCard
