-- =============================================
-- BANKLOCATOR.SA — SUPABASE DATABASE SCHEMA
-- =============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- Run once to create all tables
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE 1: BANKS
-- Master list of all banks
-- =============================================
CREATE TABLE banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,          -- e.g., 'alrajhi', 'snb', 'riyad'
    name_ar VARCHAR(100) NOT NULL,             -- Arabic name
    name_en VARCHAR(100) NOT NULL,             -- English name
    logo_url VARCHAR(500),                     -- Path to logo in repo
    website_url VARCHAR(500),                  -- Official website
    phone VARCHAR(50),                         -- Customer service number
    standard_hours_start TIME DEFAULT '09:30', -- Default opening time
    standard_hours_end TIME DEFAULT '16:30',   -- Default closing time
    standard_days VARCHAR(50) DEFAULT 'Sun-Thu', -- Working days
    brand_color VARCHAR(7),                    -- Hex color for map pins e.g., '#006B3F'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE 2: CITIES
-- Saudi cities with coordinates for map centering
-- =============================================
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    region_ar VARCHAR(100),                    -- e.g., منطقة الرياض
    region_en VARCHAR(100),                    -- e.g., Riyadh Region
    center_lat DECIMAL(10, 7),                 -- City center latitude
    center_lng DECIMAL(10, 7),                 -- City center longitude
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE 3: LOCATIONS
-- Branches, ATMs, Remittance Centers
-- =============================================
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
    city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('branch', 'atm', 'remittance_center')),
    name_ar VARCHAR(200),
    name_en VARCHAR(200),
    address_ar TEXT,
    address_en TEXT,
    latitude DECIMAL(10, 7),                   -- Can be NULL initially
    longitude DECIMAL(10, 7),                  -- Can be NULL initially
    google_maps_url TEXT,                      -- Original Google Maps link
    phone VARCHAR(50),
    hours_start TIME,                          -- Branch-specific if different
    hours_end TIME,
    is_24_hours BOOLEAN DEFAULT FALSE,
    is_islamic BOOLEAN DEFAULT FALSE,          -- Islamic banking branch
    services TEXT[],                           -- Array: ['loans', 'forex', 'safe_deposit']
    is_active BOOLEAN DEFAULT TRUE,
    last_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast map queries
CREATE INDEX idx_locations_coords ON locations(latitude, longitude) WHERE latitude IS NOT NULL;
CREATE INDEX idx_locations_bank ON locations(bank_id);
CREATE INDEX idx_locations_city ON locations(city_id);
CREATE INDEX idx_locations_type ON locations(type);

-- =============================================
-- TABLE 4: SPECIAL_HOURS
-- Ramadan, Eid, National Day special timings
-- =============================================
CREATE TABLE special_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,  -- For bank-wide rules
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN (
        'ramadan', 'eid_fitr', 'eid_adha', 'national_day', 'founding_day', 'hajj', 'other'
    )),
    event_name VARCHAR(100),                   -- e.g., "Ramadan 1447H"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    hours_start TIME,
    hours_end TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE 5: ANNOUNCEMENT_REACTIONS
-- Like/Dislike counts for stories
-- =============================================
CREATE TABLE announcement_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id VARCHAR(50) NOT NULL,      -- Matches JSON id
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(announcement_id)
);

-- =============================================
-- TABLE 6: ANALYTICS (Optional)
-- Track page views, PDF downloads, etc.
-- =============================================
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,           -- 'page_view', 'pdf_download', 'map_search'
    event_data JSONB,                          -- Flexible data storage
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Enable for production security
-- =============================================

-- Enable RLS on all tables
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view)
CREATE POLICY "Public read banks" ON banks FOR SELECT USING (true);
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read special_hours" ON special_hours FOR SELECT USING (true);
CREATE POLICY "Public read reactions" ON announcement_reactions FOR SELECT USING (true);

-- Public can update reactions (like/dislike)
CREATE POLICY "Public update reactions" ON announcement_reactions FOR UPDATE USING (true);
CREATE POLICY "Public insert reactions" ON announcement_reactions FOR INSERT WITH CHECK (true);

-- Public can insert analytics
CREATE POLICY "Public insert analytics" ON analytics FOR INSERT WITH CHECK (true);

-- =============================================
-- INITIAL SEED DATA: CITIES
-- =============================================
INSERT INTO cities (name_ar, name_en, region_ar, region_en, center_lat, center_lng) VALUES
('الرياض', 'Riyadh', 'منطقة الرياض', 'Riyadh Region', 24.7136, 46.6753),
('جدة', 'Jeddah', 'منطقة مكة المكرمة', 'Makkah Region', 21.4858, 39.1925),
('مكة المكرمة', 'Makkah', 'منطقة مكة المكرمة', 'Makkah Region', 21.3891, 39.8579),
('المدينة المنورة', 'Madinah', 'منطقة المدينة المنورة', 'Madinah Region', 24.5247, 39.5692),
('الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4207, 50.0888),
('الخبر', 'Khobar', 'المنطقة الشرقية', 'Eastern Province', 26.2172, 50.1971),
('الظهران', 'Dhahran', 'المنطقة الشرقية', 'Eastern Province', 26.2361, 50.0393),
('الطائف', 'Taif', 'منطقة مكة المكرمة', 'Makkah Region', 21.2703, 40.4158),
('تبوك', 'Tabuk', 'منطقة تبوك', 'Tabuk Region', 28.3838, 36.5550),
('بريدة', 'Buraidah', 'منطقة القصيم', 'Qassim Region', 26.3260, 43.9750),
('خميس مشيط', 'Khamis Mushait', 'منطقة عسير', 'Asir Region', 18.3064, 42.7296),
('أبها', 'Abha', 'منطقة عسير', 'Asir Region', 18.2164, 42.5053),
('حائل', 'Hail', 'منطقة حائل', 'Hail Region', 27.5114, 41.7208),
('نجران', 'Najran', 'منطقة نجران', 'Najran Region', 17.4933, 44.1277),
('جيزان', 'Jazan', 'منطقة جازان', 'Jazan Region', 16.8892, 42.5511),
('ينبع', 'Yanbu', 'منطقة المدينة المنورة', 'Madinah Region', 24.0895, 38.0634),
('الجبيل', 'Jubail', 'المنطقة الشرقية', 'Eastern Province', 27.0046, 49.6225),
('الأحساء', 'Al-Ahsa', 'المنطقة الشرقية', 'Eastern Province', 25.3648, 49.5880),
('القطيف', 'Qatif', 'المنطقة الشرقية', 'Eastern Province', 26.5196, 50.0115),
('سكاكا', 'Sakaka', 'منطقة الجوف', 'Jouf Region', 29.9697, 40.2064);

-- =============================================
-- INITIAL SEED DATA: BANKS
-- =============================================
INSERT INTO banks (code, name_ar, name_en, brand_color, website_url) VALUES
('alrajhi', 'مصرف الراجحي', 'Al Rajhi Bank', '#004D3D', 'https://www.alrajhibank.com.sa'),
('snb', 'البنك الأهلي السعودي', 'Saudi National Bank (SNB)', '#006B3F', 'https://www.alahli.com'),
('riyad', 'بنك الرياض', 'Riyad Bank', '#00529B', 'https://www.riyadbank.com'),
('albilad', 'بنك البلاد', 'Bank Albilad', '#00A650', 'https://www.bankalbilad.com.sa'),
('alinma', 'مصرف الإنماء', 'Alinma Bank', '#0066B3', 'https://www.alinma.com'),
('bsf', 'البنك السعودي الفرنسي', 'Banque Saudi Fransi', '#003366', 'https://www.bsf.sa'),
('anb', 'البنك العربي الوطني', 'Arab National Bank', '#003366', 'https://www.anb.com.sa'),
('aljazira', 'بنك الجزيرة', 'Bank AlJazira', '#00539B', 'https://www.bankaljazira.com'),
('saib', 'البنك السعودي للاستثمار', 'Saudi Investment Bank (SAIB)', '#1C4587', 'https://www.saib.com.sa'),
('emiratesnbd', 'الإمارات دبي الوطني', 'Emirates NBD', '#E4002B', 'https://www.emiratesnbd.com.sa'),
('samba', 'سامبا', 'Samba (now SNB)', '#006B3F', 'https://www.alahli.com'),
('alawwal', 'البنك الأول', 'Alawwal Bank (now SNB)', '#006B3F', 'https://www.alahli.com');

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(ann_id VARCHAR(50))
RETURNS void AS $$
BEGIN
    INSERT INTO announcement_reactions (announcement_id, likes_count)
    VALUES (ann_id, 1)
    ON CONFLICT (announcement_id)
    DO UPDATE SET likes_count = announcement_reactions.likes_count + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to increment dislikes
CREATE OR REPLACE FUNCTION increment_dislikes(ann_id VARCHAR(50))
RETURNS void AS $$
BEGIN
    INSERT INTO announcement_reactions (announcement_id, dislikes_count)
    VALUES (ann_id, 1)
    ON CONFLICT (announcement_id)
    DO UPDATE SET dislikes_count = announcement_reactions.dislikes_count + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DONE!
-- =============================================
-- After running this:
-- 1. Check Tables in Supabase dashboard
-- 2. Copy your Project URL and anon key
-- 3. Add to Vercel environment variables
-- =============================================
