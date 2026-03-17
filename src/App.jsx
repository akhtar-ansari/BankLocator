import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ComingSoonModal from './components/ComingSoonModal'

function App() {
  const [language, setLanguage] = useState('ar') // 'ar' or 'en'
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState('')
  
  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar')
  }
  
  const openComingSoon = (feature) => {
    setComingSoonFeature(feature)
    setShowComingSoon(true)
  }
  
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-light">
        <Header 
          language={language} 
          toggleLanguage={toggleLanguage}
          openComingSoon={openComingSoon}
        />
        
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  language={language}
                  openComingSoon={openComingSoon}
                />
              } 
            />
            <Route 
              path="/about" 
              element={<AboutPage language={language} />} 
            />
          </Routes>
        </main>
        
        <Footer language={language} />
        
        {showComingSoon && (
          <ComingSoonModal 
            feature={comingSoonFeature}
            language={language}
            onClose={() => setShowComingSoon(false)}
          />
        )}
      </div>
    </BrowserRouter>
  )
}

export default App
