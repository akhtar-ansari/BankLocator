import React, { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import announcements from '../data/announcements.json'
import { reactionsAPI } from '../lib/supabase'

function StoriesCarousel({ language }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reactions, setReactions] = useState({})
  const [userReactions, setUserReactions] = useState({})
  const [isHovered, setIsHovered] = useState(false)
  
  // Auto-rotate every 5 seconds (pause on hover)
  useEffect(() => {
    if (isHovered || announcements.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % announcements.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [isHovered])
  
  // Load reactions from Supabase
  useEffect(() => {
    loadReactions()
  }, [])
  
  const loadReactions = async () => {
    try {
      const data = await reactionsAPI.getAllReactions()
      const reactionsMap = {}
      data.forEach(r => {
        reactionsMap[r.announcement_id] = {
          likes: r.likes_count,
          dislikes: r.dislikes_count
        }
      })
      setReactions(reactionsMap)
    } catch (err) {
      console.error('Error loading reactions:', err)
    }
  }
  
  const handleLike = async (id) => {
    if (userReactions[id]) return
    try {
      await reactionsAPI.like(id)
      setReactions(prev => ({
        ...prev,
        [id]: {
          likes: (prev[id]?.likes || 0) + 1,
          dislikes: prev[id]?.dislikes || 0
        }
      }))
      setUserReactions(prev => ({ ...prev, [id]: 'like' }))
    } catch (err) {
      console.error('Error liking:', err)
    }
  }
  
  const handleDislike = async (id) => {
    if (userReactions[id]) return
    try {
      await reactionsAPI.dislike(id)
      setReactions(prev => ({
        ...prev,
        [id]: {
          likes: prev[id]?.likes || 0,
          dislikes: (prev[id]?.dislikes || 0) + 1
        }
      }))
      setUserReactions(prev => ({ ...prev, [id]: 'dislike' }))
    } catch (err) {
      console.error('Error disliking:', err)
    }
  }
  
  const goNext = () => {
    setCurrentIndex(prev => (prev + 1) % announcements.length)
  }
  
  const goPrev = () => {
    setCurrentIndex(prev => (prev - 1 + announcements.length) % announcements.length)
  }
  
  if (announcements.length === 0) return null
  
  const story = announcements[currentIndex]
  const headline = language === 'ar' ? story.headline_ar : story.headline_en
  const storyReactions = reactions[story.id] || { likes: 0, dislikes: 0 }
  const userReaction = userReactions[story.id]
  
  // Format date
  const date = new Date(story.date)
  const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))
  const dateText = daysAgo === 0 
    ? (language === 'ar' ? 'اليوم' : 'Today')
    : daysAgo === 1 
      ? (language === 'ar' ? 'أمس' : 'Yesterday')
      : (language === 'ar' ? `منذ ${daysAgo} أيام` : `${daysAgo}d ago`)
  
  return (
    <div 
      className="bg-dark rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-40 bg-gray-800">
        <img
          src={`/assets/announcements/${story.image}`}
          alt={headline}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160"><rect fill="%231C2526" width="400" height="160"/><text fill="%23666" x="200" y="85" text-anchor="middle" font-size="14">News Image</text></svg>'
          }}
        />
        
        {/* Navigation Arrows */}
        {announcements.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        
        {/* Source & Date Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            📰 {story.source}
          </span>
          <span className="bg-black/60 text-gray-300 text-xs px-2 py-1 rounded-full">
            {dateText}
          </span>
        </div>
        
        {/* Dots Indicator */}
        {announcements.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {announcements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Headline */}
        <h3 className="text-white font-medium text-sm line-clamp-2 mb-3 leading-relaxed">
          {headline}
        </h3>
        
        {/* Actions Row */}
        <div className="flex items-center justify-between">
          {/* Like/Dislike */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(story.id)}
              disabled={!!userReaction}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                userReaction === 'like' 
                  ? 'text-green-400' 
                  : 'text-gray-400 hover:text-green-400'
              }`}
            >
              <ThumbsUp size={16} fill={userReaction === 'like' ? 'currentColor' : 'none'} />
              <span>{storyReactions.likes}</span>
            </button>
            
            <button
              onClick={() => handleDislike(story.id)}
              disabled={!!userReaction}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                userReaction === 'dislike' 
                  ? 'text-red-400' 
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <ThumbsDown size={16} fill={userReaction === 'dislike' ? 'currentColor' : 'none'} />
              <span>{storyReactions.dislikes}</span>
            </button>
          </div>
          
          {/* Read More Link */}
          {story.link && (
            <a
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500 hover:text-gold-400 transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoriesCarousel
