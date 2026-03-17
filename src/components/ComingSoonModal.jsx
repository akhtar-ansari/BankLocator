import React from 'react'
import { X, Rocket, Bell } from 'lucide-react'

function ComingSoonModal({ feature, language, onClose }) {
  const t = {
    ar: {
      comingSoon: 'قريباً',
      featureComingSoon: 'قريباً',
      description: 'نعمل على إضافة هذه الميزة. تابعونا للمزيد من التحديثات!',
      close: 'إغلاق',
      stayTuned: 'ترقبوا التحديثات'
    },
    en: {
      comingSoon: 'Coming Soon',
      featureComingSoon: 'Coming Soon',
      description: "We're working on adding this feature. Stay tuned for updates!",
      close: 'Close',
      stayTuned: 'Stay Tuned'
    }
  }
  
  const text = t[language]
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <Rocket size={36} className="text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">
            {feature}
          </h2>
          <p className="text-gold-600 font-medium mb-4">
            {text.featureComingSoon}
          </p>
          <p className="text-gray-600 text-sm mb-6">
            {text.description}
          </p>
          
          {/* Stay Tuned Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-saudi-green-50 text-saudi-green-600 rounded-full text-sm mb-6">
            <Bell size={16} />
            <span>{text.stayTuned}</span>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            {text.close}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonModal
