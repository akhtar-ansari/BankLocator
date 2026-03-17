import React, { useState } from 'react'
import { X, Navigation, Phone, Clock, MapPin, Share2, AlertTriangle, Send, CheckCircle } from 'lucide-react'

// WhatsApp icon component
const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

function LocationCard({ location, language, onClose }) {
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportText, setReportText] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const t = {
    ar: {
      directions: 'الاتجاهات',
      call: 'اتصال',
      share: 'مشاركة',
      reportIssue: 'إبلاغ عن مشكلة',
      open24: 'مفتوح 24 ساعة',
      closed: 'مغلق',
      openNow: 'مفتوح الآن',
      hours: 'ساعات العمل',
      services: 'الخدمات',
      wheelchair: 'كرسي متحرك',
      womenSection: 'قسم نسائي',
      driveThru: 'خدمة السيارات',
      foreignExchange: 'صرف عملات',
      reportPlaceholder: 'اكتب المشكلة هنا...',
      submit: 'إرسال',
      cancel: 'إلغاء',
      thankYou: 'شكراً لك! تم استلام البلاغ.',
      shareText: 'شاهد هذا الموقع'
    },
    en: {
      directions: 'Directions',
      call: 'Call',
      share: 'Share',
      reportIssue: 'Report Issue',
      open24: 'Open 24 Hours',
      closed: 'Closed',
      openNow: 'Open Now',
      hours: 'Working Hours',
      services: 'Services',
      wheelchair: 'Wheelchair',
      womenSection: 'Women Section',
      driveThru: 'Drive-thru',
      foreignExchange: 'Foreign Exchange',
      reportPlaceholder: 'Describe the issue...',
      submit: 'Submit',
      cancel: 'Cancel',
      thankYou: 'Thank you! Report received.',
      shareText: 'Check out this location'
    }
  }
  
  const text = t[language]
  
  // Get display values
  const name = language === 'ar' ? location.name_ar : location.name_en
  const address = language === 'ar' ? location.address_ar : location.address_en
  const bankName = language === 'ar' ? location.bank?.name_ar : location.bank?.name_en
  
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
    
    // TODO: Send to Supabase or API
    // For now, just simulate submission
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
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowReportForm(false)
      setReportSubmitted(false)
    }, 3000)
  }
  
  // Services list
  const services = []
  if (location.is_24_hours) services.push(text.open24)
  if (location.wheelchair_accessible) services.push(text.wheelchair)
  if (location.women_section) services.push(text.womenSection)
  if (location.drive_thru) services.push(text.driveThru)
  if (location.foreign_exchange) services.push(text.foreignExchange)
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-saudi-green-500 text-white p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-green-100 mb-1">{bankName}</p>
            <h3 className="font-bold text-lg">{name}</h3>
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
      <div className="p-4 space-y-4">
        
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">{address}</p>
        </div>
        
        {/* Hours */}
        {location.is_24_hours ? (
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-gray-400" />
            <span className="text-sm text-green-600 font-medium">{text.open24}</span>
          </div>
        ) : location.working_hours && (
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-1">{text.hours}</p>
              <p>{location.working_hours}</p>
            </div>
          </div>
        )}
        
        {/* Services */}
        {services.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {services.map((service, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Directions */}
          <button
            onClick={openDirections}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-saudi-green-500 text-white rounded-lg hover:bg-saudi-green-600 transition-colors"
          >
            <Navigation size={16} />
            <span className="text-sm font-medium">{text.directions}</span>
          </button>
          
          {/* Call */}
          <button
            onClick={callPhone}
            disabled={!location.phone}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
              location.phone
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Phone size={16} />
            <span className="text-sm font-medium">{text.call}</span>
          </button>
          
          {/* WhatsApp Share */}
          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <WhatsAppIcon size={16} />
            <span className="text-sm font-medium">{text.share}</span>
          </button>
          
          {/* Report Issue */}
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">{text.reportIssue}</span>
          </button>
        </div>
        
        {/* Report Issue Form */}
        {showReportForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            {reportSubmitted ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">{text.thankYou}</span>
              </div>
            ) : (
              <>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder={text.reportPlaceholder}
                  className="w-full p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saudi-green-500"
                  rows={3}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={submitReport}
                    disabled={!reportText.trim() || submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-saudi-green-500 text-white rounded-lg hover:bg-saudi-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                    <span className="text-sm">{submitting ? '...' : text.submit}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowReportForm(false)
                      setReportText('')
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <span className="text-sm">{text.cancel}</span>
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
