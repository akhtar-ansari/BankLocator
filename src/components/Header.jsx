import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, MapPin, CreditCard, Landmark, ArrowLeftRight, Info } from 'lucide-react'

function Header({ language, toggleLanguage, openComingSoon }) {
  const t = {
    ar: {
      locator: 'محدد الفروع',
      loans: 'القروض',
      creditCards: 'البطاقات',
      comparisons: 'المقارنات',
      about: 'عن الموقع',
      comingSoon: 'قريباً'
    },
    en: {
      locator: 'Locator',
      loans: 'Loans',
      creditCards: 'Cards',
      comparisons: 'Compare',
      about: 'About',
      comingSoon: 'Coming Soon'
    }
  }
  
  const text = t[language]
  
  const navItems = [
    { key: 'locator', icon: MapPin, path: '/', active: true },
    { key: 'loans', icon: Landmark, comingSoon: true },
    { key: 'creditCards', icon: CreditCard, comingSoon: true },
    { key: 'comparisons', icon: ArrowLeftRight, comingSoon: true },
    { key: 'about', icon: Info, path: '/about' }
  ]
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <video 
              className="logo-video w-10 h-10"
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="/assets/banklocator.mp4" type="video/mp4" />
            </video>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-saudi-green-500">
                {language === 'ar' ? 'محدد فروع البنوك' : 'Bank Locator'}
              </h1>
              <p className="text-xs text-gray-500">
                {language === 'ar' ? 'جميع البنوك السعودية' : 'All Saudi Banks'}
              </p>
            </div>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon
              
              if (item.comingSoon) {
                return (
                  <button
                    key={item.key}
                    onClick={() => openComingSoon(text[item.key])}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Icon size={18} />
                    <span className="text-sm">{text[item.key]}</span>
                    <span className="coming-soon-badge">{text.comingSoon}</span>
                  </button>
                )
              }
              
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-saudi-green-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{text[item.key]}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-saudi-green-500 hover:bg-saudi-green-50 transition-colors"
          >
            <Globe size={18} className="text-saudi-green-500" />
            <span className="text-sm font-medium text-saudi-green-500">
              {language === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon
            
            if (item.comingSoon) {
              return (
                <button
                  key={item.key}
                  onClick={() => openComingSoon(text[item.key])}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-gray-600 bg-gray-100 whitespace-nowrap"
                >
                  <Icon size={14} />
                  <span>{text[item.key]}</span>
                </button>
              )
            }
            
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                  item.active 
                    ? 'bg-saudi-green-500 text-white' 
                    : 'text-gray-600 bg-gray-100'
                }`}
              >
                <Icon size={14} />
                <span>{text[item.key]}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Header
