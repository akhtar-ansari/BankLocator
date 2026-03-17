import React from 'react'
import { Shield, MapPin, Clock, Users, Mail, Globe, CheckCircle } from 'lucide-react'

function AboutPage({ language }) {
  const t = {
    ar: {
      title: 'عن محدد فروع البنوك',
      subtitle: 'جميع البنوك السعودية في خريطة واحدة',
      mission: 'مهمتنا',
      missionText: 'نهدف إلى توفير أسهل وأسرع طريقة للعثور على أقرب فرع بنك أو صراف آلي في المملكة العربية السعودية. نجمع بيانات جميع البنوك في مكان واحد لتوفير وقتك وجهدك.',
      features: 'مميزاتنا',
      feature1Title: 'جميع البنوك',
      feature1Text: 'أكثر من 10 بنوك سعودية مع آلاف الفروع والصرافات',
      feature2Title: 'تحديث مستمر',
      feature2Text: 'بيانات محدثة يومياً مع ساعات العمل والأوقات الخاصة',
      feature3Title: 'سهولة الاستخدام',
      feature3Text: 'خريطة تفاعلية مع فلاتر ذكية وتحديد موقعك الحالي',
      feature4Title: 'خصوصية تامة',
      feature4Text: 'لا نجمع أي بيانات شخصية - لا اسم، لا رقم جوال، لا إقامة',
      privacy: 'الخصوصية',
      privacyText: 'نحن نحترم خصوصيتك. لا نطلب ولا نجمع أي بيانات شخصية. يمكنك استخدام الموقع بحرية تامة دون تسجيل أو تقديم أي معلومات.',
      privacyBadges: [
        'لا نجمع البريد الإلكتروني',
        'لا نطلب رقم الجوال',
        'لا نخزن رقم الإقامة',
        'لا نتتبع موقعك'
      ],
      disclaimer: 'إخلاء المسؤولية',
      disclaimerText: 'البيانات المعروضة مجمعة من مصادر عامة وتقارير المستخدمين. يرجى التحقق مباشرة من البنك قبل الزيارة. نحن غير مسؤولين عن أي أخطاء أو تغييرات في المعلومات.',
      contact: 'تواصل معنا',
      contactText: 'لديك سؤال أو اقتراح؟ تواصل معنا عبر البريد الإلكتروني:',
      poweredBy: 'تم التطوير بواسطة'
    },
    en: {
      title: 'About Bank Locator',
      subtitle: 'All Saudi banks in one map',
      mission: 'Our Mission',
      missionText: 'We aim to provide the easiest and fastest way to find the nearest bank branch or ATM in Saudi Arabia. We aggregate data from all banks in one place to save your time and effort.',
      features: 'Features',
      feature1Title: 'All Banks',
      feature1Text: 'More than 10 Saudi banks with thousands of branches and ATMs',
      feature2Title: 'Always Updated',
      feature2Text: 'Data updated daily with working hours and special timings',
      feature3Title: 'Easy to Use',
      feature3Text: 'Interactive map with smart filters and location detection',
      feature4Title: 'Complete Privacy',
      feature4Text: 'We never collect personal data - no name, no phone, no Iqama',
      privacy: 'Privacy',
      privacyText: 'We respect your privacy. We never ask for or collect any personal data. You can use the site freely without registration or providing any information.',
      privacyBadges: [
        'No email collection',
        'No phone number required',
        'No Iqama storage',
        'No location tracking'
      ],
      disclaimer: 'Disclaimer',
      disclaimerText: 'Data shown is collected from public sources and user reports. Please verify directly with the bank before visiting. We are not responsible for any errors or changes in information.',
      contact: 'Contact Us',
      contactText: 'Have a question or suggestion? Contact us via email:',
      poweredBy: 'Powered by'
    }
  }
  
  const text = t[language]
  
  const features = [
    { icon: MapPin, title: text.feature1Title, desc: text.feature1Text },
    { icon: Clock, title: text.feature2Title, desc: text.feature2Text },
    { icon: Users, title: text.feature3Title, desc: text.feature3Text },
    { icon: Shield, title: text.feature4Title, desc: text.feature4Text }
  ]
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-dark mb-2">{text.title}</h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>
      
      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-saudi-green-500 mb-4 flex items-center gap-2">
          <Globe size={24} />
          {text.mission}
        </h2>
        <p className="text-gray-700 leading-relaxed">{text.missionText}</p>
      </section>
      
      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-saudi-green-500 mb-6">{text.features}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="card flex gap-4">
                <div className="w-12 h-12 rounded-full bg-saudi-green-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={24} className="text-saudi-green-500" />
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      
      {/* Privacy Section */}
      <section className="mb-12 bg-green-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-saudi-green-500 mb-4 flex items-center gap-2">
          <Shield size={24} />
          {text.privacy}
        </h2>
        <p className="text-gray-700 mb-4">{text.privacyText}</p>
        <div className="grid grid-cols-2 gap-3">
          {text.privacyBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle size={16} />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Disclaimer */}
      <section className="mb-12 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <h2 className="text-xl font-bold text-yellow-700 mb-4">{text.disclaimer}</h2>
        <p className="text-yellow-800 text-sm">{text.disclaimerText}</p>
      </section>
      
      {/* Contact */}
      <section className="text-center">
        <h2 className="text-xl font-bold text-saudi-green-500 mb-4 flex items-center justify-center gap-2">
          <Mail size={24} />
          {text.contact}
        </h2>
        <p className="text-gray-600 mb-4">{text.contactText}</p>
        <a 
          href="mailto:connect.arwaenterprises@gmail.com"
          className="inline-flex items-center gap-2 text-saudi-green-500 hover:text-saudi-green-600 font-medium"
        >
          <Mail size={18} />
          connect.arwaenterprises@gmail.com
        </a>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500">
            {text.poweredBy}{' '}
            <span className="text-gold-500 font-medium">Arwa Enterprises</span>
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
