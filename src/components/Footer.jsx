import React from 'react'
import { Mail, ExternalLink } from 'lucide-react'

function Footer({ language }) {
  const t = {
    ar: {
      poweredBy: 'تم التطوير بواسطة',
      contact: 'تواصل معنا',
      disclaimer: 'إخلاء المسؤولية',
      disclaimerText: 'البيانات مجمعة من مصادر عامة وتقارير المستخدمين. يرجى التحقق مباشرة من البنك قبل الزيارة.',
      noDataCollection: 'لا نجمع أي بيانات شخصية',
      rights: 'جميع الحقوق محفوظة'
    },
    en: {
      poweredBy: 'Powered by',
      contact: 'Contact',
      disclaimer: 'Disclaimer',
      disclaimerText: 'Data is collected from public sources and user reports. Always verify with the bank before visiting.',
      noDataCollection: 'We never collect personal data',
      rights: 'All rights reserved'
    }
  }
  
  const text = t[language]
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Powered By */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <video 
                className="w-8 h-8"
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/assets/banklocator.mp4" type="video/mp4" />
              </video>
              <span className="font-bold text-lg">
                {language === 'ar' ? 'محدد فروع البنوك' : 'Bank Locator'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {language === 'ar' 
                ? 'جميع البنوك السعودية في خريطة واحدة'
                : 'All Saudi banks in one map'
              }
            </p>
            <div className="text-sm text-gray-400">
              <span>{text.poweredBy}</span>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold-500 hover:text-gold-400 mx-1 font-medium"
              >
                Arwa Enterprises
              </a>
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">{text.contact}</h3>
            <a 
              href="mailto:connect.arwaenterprises@gmail.com"
              className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors"
            >
              <Mail size={18} />
              <span className="text-sm">connect.arwaenterprises@gmail.com</span>
            </a>
          </div>
          
          {/* Disclaimer */}
          <div>
            <h3 className="font-bold mb-4">{text.disclaimer}</h3>
            <p className="text-gray-400 text-sm mb-2">
              {text.disclaimerText}
            </p>
            <p className="text-green-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {text.noDataCollection}
            </p>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} BankLocator.sa — {text.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
