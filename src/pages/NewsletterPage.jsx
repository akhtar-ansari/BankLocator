import React from 'react'
import StoriesCarousel from '../components/StoriesCarousel'
import { ExternalLink, Bell, Building2, AlertCircle } from 'lucide-react'

function NewsletterPage({ language }) {
  const t = {
    ar: {
      title: 'النشرة الإخبارية',
      subtitle: 'آخر أخبار البنوك وتحديثات ساما',
      latestNews: 'آخر الأخبار',
      samaNotices: 'إشعارات ساما',
      bankUpdates: 'تحديثات البنوك',
      readMore: 'اقرأ المزيد',
      noNotices: 'لا توجد إشعارات حالياً',
      comingSoon: 'المزيد قريباً...',
      ramadanHours: 'ساعات العمل في رمضان',
      ramadanDesc: 'جميع البنوك تعمل من 10 صباحاً حتى 4 مساءً خلال شهر رمضان المبارك',
      eidHoliday: 'إجازة عيد الفطر',
      eidDesc: 'البنوك مغلقة من 29 رمضان حتى 3 شوال',
      newBranch: 'فروع جديدة',
      newBranchDesc: 'افتتاح فروع جديدة في الرياض وجدة'
    },
    en: {
      title: 'Newsletter',
      subtitle: 'Latest banking news and SAMA updates',
      latestNews: 'Latest News',
      samaNotices: 'SAMA Notices',
      bankUpdates: 'Bank Updates',
      readMore: 'Read More',
      noNotices: 'No notices at this time',
      comingSoon: 'More coming soon...',
      ramadanHours: 'Ramadan Working Hours',
      ramadanDesc: 'All banks operate from 10 AM to 4 PM during the holy month of Ramadan',
      eidHoliday: 'Eid Al-Fitr Holiday',
      eidDesc: 'Banks closed from Ramadan 29 to Shawwal 3',
      newBranch: 'New Branches',
      newBranchDesc: 'New branches opening in Riyadh and Jeddah'
    }
  }
  
  const text = t[language]
  
  // Sample SAMA notices (later can come from Supabase)
  const samaNotices = [
    {
      id: 1,
      icon: AlertCircle,
      title: text.ramadanHours,
      description: text.ramadanDesc,
      date: '2026-03-10',
      type: 'info',
      link: 'https://sama.gov.sa'
    },
    {
      id: 2,
      icon: Bell,
      title: text.eidHoliday,
      description: text.eidDesc,
      date: '2026-03-15',
      type: 'warning',
      link: 'https://sama.gov.sa'
    }
  ]
  
  // Sample bank updates
  const bankUpdates = [
    {
      id: 1,
      bank: 'Al Rajhi',
      title: text.newBranch,
      description: text.newBranchDesc,
      date: '2026-03-12'
    }
  ]
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', options)
  }
  
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{text.title}</h1>
          <p className="text-gray-500 mt-1">{text.subtitle}</p>
        </div>
        
        {/* Main Content: 2 Columns */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Left Column: Carousel */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-saudi-green-500" />
              {text.latestNews}
            </h2>
            <StoriesCarousel language={language} />
            
            {/* Bank Updates Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-saudi-green-500" />
                {text.bankUpdates}
              </h2>
              
              <div className="space-y-3">
                {bankUpdates.map(update => (
                  <div 
                    key={update.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs text-saudi-green-500 font-medium">
                          {update.bank}
                        </span>
                        <h3 className="font-medium text-gray-800 mt-1">
                          {update.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {update.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(update.date)}
                      </span>
                    </div>
                  </div>
                ))}
                
                <p className="text-sm text-gray-400 text-center py-2">
                  {text.comingSoon}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column: SAMA Notices */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-saudi-green-500" />
              {text.samaNotices}
            </h2>
            
            <div className="space-y-4">
              {samaNotices.map(notice => {
                const Icon = notice.icon
                const bgColor = notice.type === 'warning' 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-blue-50 border-blue-200'
                const iconColor = notice.type === 'warning'
                  ? 'text-amber-500'
                  : 'text-blue-500'
                
                return (
                  <div 
                    key={notice.id}
                    className={`rounded-lg p-4 border ${bgColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-white ${iconColor}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-800">
                            {notice.title}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {formatDate(notice.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {notice.description}
                        </p>
                        {notice.link && (
                         <a 
                            href={notice.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-saudi-green-500 hover:underline mt-3"
                          >
                            {text.readMore}
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {samaNotices.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Bell size={40} className="mx-auto mb-3 opacity-50" />
                  <p>{text.noNotices}</p>
                </div>
              )}
            </div>
            
            {/* SAMA Link */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/sama-logo.png" 
                  alt="SAMA" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {language === 'ar' 
                      ? 'للمزيد من المعلومات، قم بزيارة الموقع الرسمي للبنك المركزي السعودي'
                      : 'For more information, visit the official Saudi Central Bank website'
                    }
                  </p>
                  <a
                    href="https://sama.gov.sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-saudi-green-500 hover:underline mt-1"
                  >
                    sama.gov.sa
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterPage
