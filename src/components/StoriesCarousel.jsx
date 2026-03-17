import React, { useState, useEffect, useRef } from 'react'
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, ExternalLink, RefreshCw } from 'lucide-react'
import announcements from '../data/announcements.json'
import { reactionsAPI } from '../lib/supabase'

function StoriesCarousel({ language }) {
  const [reactions, setReactions] = useState({})
  const [userReactions, setUserReactions] = useState({}) // Track user's reactions
  const scrollRef = useRef(null)
  
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
    if (userReactions[id]) return // Already reacted
    
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
    if (userReactions[id]) return // Already reacted
    
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
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320 // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }
  
  const t = {
    ar: {
      refresh: 'تحديث',
      readMore: 'اقرأ المزيد'
    },
    en: {
      refresh: 'Refresh',
      readMore: 'Read more'
    }
  }
  
  const text = t[language]
  
  return (
    <div className="bg-gradient-to-r from-saudi-green-500 to-saudi-green-600 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Scroll Arrows - Desktop */}
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex w-8 h-8 items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex w-8 h-8 items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={loadReactions}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition-colors"
          >
            <RefreshCw size={14} />
            <span>{text.refresh}</span>
          </button>
        </div>
        
        {/* Stories Container */}
        <div 
          ref={scrollRef}
          className="stories-container flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
        >
          {announcements.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              language={language}
              reactions={reactions[story.id] || { likes: 0, dislikes: 0 }}
              userReaction={userReactions[story.id]}
              onLike={() => handleLike(story.id)}
              onDislike={() => handleDislike(story.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StoryCard({ story, language, reactions, userReaction, onLike, onDislike }) {
  const headline = language === 'ar' ? story.headline_ar : story.headline_en
  
  // Format date
  const date = new Date(story.date)
  const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))
  const dateText = daysAgo === 0 
    ? (language === 'ar' ? 'اليوم' : 'Today')
    : daysAgo === 1 
      ? (language === 'ar' ? 'أمس' : 'Yesterday')
      : (language === 'ar' ? `منذ ${daysAgo} أيام` : `${daysAgo}d ago`)
  
  return (
    <div className="story-card flex-shrink-0 w-[300px] bg-dark rounded-xl overflow-hidden snap-start">
      {/* Image */}
      <div className="relative h-40 bg-gray-800">
        <img
          src={`/assets/announcements/${story.image}`}
          alt={headline}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160"><rect fill="%231C2526" width="300" height="160"/><text fill="%23666" x="150" y="80" text-anchor="middle" font-size="14">Image</text></svg>'
          }}
        />
        
        {/* Source Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            📰 {story.source}
          </span>
          <span className="bg-black/60 text-gray-300 text-xs px-2 py-1 rounded-full">
            {dateText}
          </span>
        </div>
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
          <div className="flex items-center gap-3">
            <button
              onClick={onLike}
              disabled={!!userReaction}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                userReaction === 'like' 
                  ? 'text-green-400' 
                  : 'text-gray-400 hover:text-green-400'
              } ${userReaction ? 'opacity-70' : ''}`}
            >
              <ThumbsUp size={16} fill={userReaction === 'like' ? 'currentColor' : 'none'} />
              <span>{reactions.likes}</span>
            </button>
            
            <button
              onClick={onDislike}
              disabled={!!userReaction}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                userReaction === 'dislike' 
                  ? 'text-red-400' 
                  : 'text-gray-400 hover:text-red-400'
              } ${userReaction ? 'opacity-70' : ''}`}
            >
              <ThumbsDown size={16} fill={userReaction === 'dislike' ? 'currentColor' : 'none'} />
              <span>{reactions.dislikes}</span>
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
