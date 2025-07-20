-- MyTokyoGem spots table creation
CREATE TABLE IF NOT EXISTS spots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information (多言語対応)
    title_ja TEXT NOT NULL,
    title_en TEXT,
    short_description_ja TEXT NOT NULL,
    short_description_en TEXT,
    description_ja TEXT NOT NULL,
    description_en TEXT,
    
    -- Images
    images TEXT[] DEFAULT '{}',
    
    -- Location
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    location_hide_exact BOOLEAN DEFAULT FALSE,
    location_address_ja TEXT NOT NULL,
    location_address_en TEXT,
    
    -- Categories and Tags
    primary_category TEXT NOT NULL,
    genre TEXT[] DEFAULT '{}',
    travel_style TEXT[] DEFAULT '{}',
    solo_friendly BOOLEAN DEFAULT TRUE,
    
    -- Additional Information
    business_hours_ja TEXT DEFAULT '',
    business_hours_en TEXT DEFAULT '',
    access_ja TEXT DEFAULT '',
    access_en TEXT DEFAULT '',
    tips_ja TEXT DEFAULT '',
    tips_en TEXT DEFAULT '',
    
    -- Status
    is_hidden BOOLEAN DEFAULT FALSE,
    
    -- Reactions
    reactions_interested INTEGER DEFAULT 0,
    reactions_visited INTEGER DEFAULT 0,
    
    -- Metadata
    created_by TEXT DEFAULT 'ひとりあそび研究所',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spots_is_hidden ON spots (is_hidden);
CREATE INDEX IF NOT EXISTS idx_spots_primary_category ON spots (primary_category);
CREATE INDEX IF NOT EXISTS idx_spots_solo_friendly ON spots (solo_friendly);
CREATE INDEX IF NOT EXISTS idx_spots_created_at ON spots (created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (非表示スポット以外)
CREATE POLICY "Public spots are viewable by everyone" ON spots
    FOR SELECT USING (is_hidden = FALSE);

-- Policy for authenticated users to view all spots (管理画面用)
CREATE POLICY "All spots are viewable by authenticated users" ON spots
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert spots" ON spots
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update spots" ON spots
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete spots" ON spots
    FOR DELETE USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_spots_updated_at 
    BEFORE UPDATE ON spots 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();