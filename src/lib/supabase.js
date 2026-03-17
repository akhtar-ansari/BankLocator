import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =============================================
// BANKS API
// =============================================
export const banksAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .order('name_en')
    if (error) throw error
    return data
  },
  
  getByCode: async (code) => {
    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .eq('code', code)
      .single()
    if (error) throw error
    return data
  }
}

// =============================================
// LOCATIONS API
// =============================================
export const locationsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        banks (code, name_ar, name_en, brand_color, logo_url),
        cities (name_ar, name_en)
      `)
      .eq('is_active', true)
      .not('latitude', 'is', null)
    if (error) throw error
    return data
  },
  
  getByBank: async (bankId) => {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        banks (code, name_ar, name_en, brand_color),
        cities (name_ar, name_en)
      `)
      .eq('bank_id', bankId)
      .eq('is_active', true)
    if (error) throw error
    return data
  },
  
  getByCity: async (cityId) => {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        banks (code, name_ar, name_en, brand_color),
        cities (name_ar, name_en)
      `)
      .eq('city_id', cityId)
      .eq('is_active', true)
    if (error) throw error
    return data
  },
  
  getByType: async (type) => {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        banks (code, name_ar, name_en, brand_color),
        cities (name_ar, name_en)
      `)
      .eq('type', type)
      .eq('is_active', true)
    if (error) throw error
    return data
  },
  
  get24Hours: async () => {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        banks (code, name_ar, name_en, brand_color),
        cities (name_ar, name_en)
      `)
      .eq('is_24_hours', true)
      .eq('is_active', true)
    if (error) throw error
    return data
  },
  
  // Filtered query with multiple conditions
  getFiltered: async ({ bankIds, cityId, type, is24Hours }) => {
    let query = supabase
      .from('locations')
      .select(`
        *,
        banks (code, name_ar, name_en, brand_color, logo_url),
        cities (name_ar, name_en)
      `)
      .eq('is_active', true)
      .not('latitude', 'is', null)
    
    if (bankIds && bankIds.length > 0) {
      query = query.in('bank_id', bankIds)
    }
    if (cityId) {
      query = query.eq('city_id', cityId)
    }
    if (type && type !== 'both') {
      query = query.eq('type', type)
    }
    if (is24Hours) {
      query = query.eq('is_24_hours', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }
}

// =============================================
// CITIES API
// =============================================
export const citiesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name_en')
    if (error) throw error
    return data
  }
}

// =============================================
// SPECIAL HOURS API
// =============================================
export const specialHoursAPI = {
  getCurrent: async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('special_hours')
      .select('*')
      .lte('start_date', today)
      .gte('end_date', today)
    if (error) throw error
    return data
  }
}

// =============================================
// REACTIONS API (Likes/Dislikes)
// =============================================
export const reactionsAPI = {
  getByAnnouncement: async (announcementId) => {
    const { data, error } = await supabase
      .from('announcement_reactions')
      .select('*')
      .eq('announcement_id', announcementId)
      .single()
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return data || { likes_count: 0, dislikes_count: 0 }
  },
  
  getAllReactions: async () => {
    const { data, error } = await supabase
      .from('announcement_reactions')
      .select('*')
    if (error) throw error
    return data || []
  },
  
  like: async (announcementId) => {
    const { error } = await supabase.rpc('increment_likes', { ann_id: announcementId })
    if (error) throw error
  },
  
  dislike: async (announcementId) => {
    const { error } = await supabase.rpc('increment_dislikes', { ann_id: announcementId })
    if (error) throw error
  }
}

// =============================================
// ANALYTICS API
// =============================================
export const analyticsAPI = {
  trackEvent: async (eventType, eventData = {}) => {
    const { error } = await supabase
      .from('analytics')
      .insert({ event_type: eventType, event_data: eventData })
    if (error) console.error('Analytics error:', error)
  }
}
