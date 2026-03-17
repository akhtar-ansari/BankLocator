import React, { useState } from 'react'
import { X, Navigation, Phone, Clock, MapPin, AlertTriangle, Send, CheckCircle, Building2, Landmark } from 'lucide-react'

// WhatsApp icon component
const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Bank colors
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

function LocationCard({ location, bank, city, language, onClose }) {
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportText, setReportText] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const t = {
    ar: {
      directions: 'الاتجاهات',
      call: 'اتصال',
      share: 'مشاركة',
      reportIssue: 'إبلاغ',
      open24: 'مفتوح 24 ساعة',
      closed: 'مغلق',
      open: 'مفتوح',
      hours: 'ساعات العمل',
      workingDays: 'أيام العمل',
      sunThu: 'الأحد - الخميس',
      services: 'الخدمات',
      wheelchair: 'كرسي متحرك',
      womenSection: 'قسم نسائي',
      driveThru: 'خدمة السيارات',
      foreignExchange: 'صرف عملات',
      reportPlaceholder: 'اكتب المشكلة هنا...',
      submit: 'إرسال',
      cancel: 'إلغاء',
      thankYou: 'شكراً لك! تم استلام البلاغ.',
      shareText: 'شاهد هذا الموقع',
      branch: 'فرع',
      atm: 'صراف آلي',
      both: 'فرع + صراف'
    },
    en: {
      directions: 'Directions',
      call: 'Call',
      share: 'Share',
      reportIssue: 'Report',
      open24: 'Open 24 Hours',
      closed: 'Closed',
      open: 'Open',
      hours: 'Working Hours',
      workingDays: 'Working Days',
      sunThu: 'Sun - Thu',
      services: 'Services',
      wheelchair: 'Wheelchair',
      womenSection: 'Women Section',
      driveThru: 'Drive-thru',
      foreignExchange: 'Foreign Exchange',
      reportPlaceholder: 'Describe the issue...',
      submit: 'Submit',
      cancel: 'Cancel',
      thankYou: 'Thank you! Report received.',
      shareText: 'Check out this location',
      branch: 'Branch',
      atm: 'ATM',
      both: 'Branch + ATM'
    }
  }
  
  const text = t[language]
  
  // Get display values
  const name = language === 'ar' ? location.name_ar : location.name_en
  const address = language === 'ar' ? location.address_ar : location.address_en
  const bankName = language === 'ar' ? bank?.name_ar : bank?.name_en
  const cityName = language === 'ar' ? city?.name_ar : city?.name_en
  const bankColor = BANK_COLORS[bank?.code] || '#006B3F'
  
  // Get type label and icon
  const getTypeInfo = () => {
    if (location.type === 'branch') return { label: text.branch, icon: Building2, color: 'bg-blue-100 text-blue-700' }
    if (location.type === 'atm') return { label: text.atm, icon: Landmark, color: 'bg-purple-100 text-purple-700' }
    return { label: text.both, icon: Building2, color: 'bg-green-100 text-green-700' }
  }
  
  const typeInfo = getTypeInfo()
  const TypeIcon = typeInfo.icon
  
  // Check if currently open
  const isCurrentlyOpen = () => {
    if (location.is_24_hours) return true
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    if (day === 5 || day === 6) return false
    return hour >= 9 && hour < 16
  }
  
  // Google Maps URL with coordinates
  const googleMapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`
  
  // Open Google Maps for directions
  const openDirections = () => {
    window.open(googleMapsUrl, '_blank')
  }
  
  // Call phone number
  const callPhone = () => {
    if (location.phone) {
      window.location.href = `tel:${location.phone}`
    }
  }
  
  // Share via WhatsApp with Google Maps link
  const shareWhatsApp = () => {
    const message = `${text.shareText}: ${bankName} - ${name}
📍 ${address}
🗺️ ${googleMapsUrl}`
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }
  
  // Submit report
  const submitReport = async () => {
    if (!reportText.trim()) return
    
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Report submitted:', {
      locationId: location.id,
      locationName: name,
      report: reportText,
      timestamp: new Date().toISOString()
    })
    
    setSubmitting(false)
    setReportSubmitted(true)
    setReportText('')
    
    setTimeout(() => {
      setShowReportForm(false)
      setReportSubmitted(false)
    }, 3000)
  }
  
  // Services list
  const services = []
  if (location.wheelchair_accessible) services.push(text.wheelchair)
  if (location.women_section) services.push(text.womenSection)
  if (location.drive_thru) services.push(text.driveThru)
  if (location.foreign_exchange) services.push(text.foreignExchange)
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Bank Color */}
      <div 
        className="text-white p-4"
        style={{ backgroundColor: bankColor }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Bank Name */}
            <p className="text-sm opacity-90 mb-1">{bankName}</p>
            {/* Branch Name */}
            <h3 className="font-bold text-lg leading-tight">{name}</h3>
            {/* Type Badge + City */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                <TypeIcon size={12} />
                {typeInfo.label}
              </span>
              {cityName && (
                <span className="text-xs opacity-80">• {cityName}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">{address}</p>
        </div>
        
        {/* Status + Hours */}
        <div className="flex items-start gap-3">
          <Clock size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {location.is_24_hours ? (
                <span className="text-sm text-green-600 font-medium">{text.open24}</span>
              ) : (
                <>
                  <span className={`text-sm font-medium ${isCurrentlyOpen() ? 'text-green-600' : 'text-red-600'}`}>
                    {isCurrentlyOpen() ? text.open : text.closed}
                  </span>
                  <span className="text-sm text-gray-500">
                    • {location.working_hours || '9:00 AM - 4:00 PM'}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {location.working_days || text.sunThu}
            </p>
          </div>
        </div>
        
        {/* Services */}
        {services.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {services.map((service, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        )}
        
        {/* Action Buttons - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Directions */}
          <button
            onClick={openDirections}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-saudi-green-500 text-white rounded-lg hover:bg-saudi-green-600 transition-colors text-sm font-medium"
          >
            <Navigation size={14} />
            <span>{text.directions}</span>
          </button>
          
          {/* Call */}
          <button
            onClick={callPhone}
            disabled={!location.phone}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              location.phone
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Phone size={14} />
            <span>{text.call}</span>
          </button>
          
          {/* WhatsApp Share */}
          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <WhatsAppIcon size={14} />
            <span>{text.share}</span>
          </button>
          
          {/* Report Issue */}
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            <AlertTriangle size={14} />
            <span>{text.reportIssue}</span>
          </button>
        </div>
        
        {/* Report Issue Form */}
        {showReportForm && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
            {reportSubmitted ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">{text.thankYou}</span>
              </div>
            ) : (
              <>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder={text.reportPlaceholder}
                  className="w-full p-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saudi-green-500"
                  rows={3}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={submitReport}
                    disabled={!reportText.trim() || submitting}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-saudi-green-500 text-white rounded-lg hover:bg-saudi-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Send size={12} />
                    <span>{submitting ? '...' : text.submit}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowReportForm(false)
                      setReportText('')
                    }}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    {text.cancel}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationCard
