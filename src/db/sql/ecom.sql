-- ========================================
-- 1. CATEGORY, SUBCATEGORY, BRAND TABLES
-- ========================================

-- Categories (Decor, Kitchen, Beauty)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500), -- Small image for listings
    cover_pic_url VARCHAR(500), -- Large banner image
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    parent_category_id INT REFERENCES categories(id) NULL, -- For nested categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_categories_active (is_active),
    INDEX idx_categories_slug (slug),
    -- INDEX idx_categories_parent (parent_category_id)
);

-- Subcategories (Ply Decor, Flower Pot, Face Wash, Moisturizer, etc.)
CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    cover_pic_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    attributes JSONB DEFAULT '{}', -- JSON for subcategory-specific attributes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint for slug within category
    UNIQUE(category_id, slug),
    
    -- Indexes
    INDEX idx_subcategories_category (category_id),
    INDEX idx_subcategories_active (is_active),
    INDEX idx_subcategories_slug (slug)
);

-- Brands (Cetaphil, etc. - Max 5 brands for Beauty category)
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500), -- Logo
    cover_pic_url VARCHAR(500), -- Brand banner
    website_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    category_id INT REFERENCES categories(id) NULL, -- Brand can be specific to category
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_brands_active (is_active),
    INDEX idx_brands_slug (slug),
    INDEX idx_brands_category (category_id)
);

-- ========================================



-- Main Product Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL, -- Master SKU
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id INT REFERENCES categories(id),
    subcategory_id INT REFERENCES subcategories(id),
    brand_id INT REFERENCES brands(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_variant_product BOOLEAN DEFAULT FALSE, -- Whether this product has variants
    master_product_id INT REFERENCES products(id) NULL, -- For grouping variants under master
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_products_category (category_id),
    INDEX idx_products_brand (brand_id),
    INDEX idx_products_active (is_active)
);


-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- 2. ATTRIBUTE MANAGEMENT

-- Product Attributes (Size, Color, Material, etc.)
CREATE TABLE product_attributes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Size', 'Color', 'Material'
    slug VARCHAR(100) UNIQUE NOT NULL, -- 'size', 'color', 'material'
    display_name VARCHAR(100), -- Display name for frontend
    display_order INT DEFAULT 0,
    is_filterable BOOLEAN DEFAULT TRUE,
    is_variant_attribute BOOLEAN DEFAULT TRUE, -- Whether this attribute creates variants
    attribute_type VARCHAR(50) DEFAULT 'text', -- 'text', 'number', 'color', 'image'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attribute Values (Small, Medium, Large, Red, Blue, etc.)
CREATE TABLE attribute_values (
    id SERIAL PRIMARY KEY,
    attribute_id INT REFERENCES product_attributes(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL, -- 'M', 'Large', 'Red', 'Blue'
    display_value VARCHAR(255), -- 'Medium', 'Large', 'Red'
    color_hex VARCHAR(7) NULL, -- For color swatches: '#FF0000'
    image_url VARCHAR(500) NULL, -- For image swatches
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique value per attribute
    UNIQUE(attribute_id, value)
);


-- 3. VARIANT SYSTEM
-- ======================

-- Product Variants (Combinations of attributes)
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL, -- Variant SKU (e.g., TSHIRT-BLUE-M)
    is_default_variant BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite indexes for performance
    INDEX idx_variants_product (product_id),
    INDEX idx_variants_active (is_active)
);

CREATE TRIGGER update_variants_updated_at 
    BEFORE UPDATE ON product_variants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Link variants to their attribute values
CREATE TABLE variant_attributes (
    id SERIAL PRIMARY KEY,
    variant_id INT REFERENCES product_variants(id) ON DELETE CASCADE,
    attribute_id INT REFERENCES product_attributes(id),
    attribute_value_id INT REFERENCES attribute_values(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one attribute type per variant
    UNIQUE(variant_id, attribute_id),
    
    -- Indexes for performance
    INDEX idx_variant_attrs_variant (variant_id),
    INDEX idx_variant_attrs_value (attribute_value_id)
);




-- ======================
-- 4. PRICING SYSTEM
-- ======================

-- Base price per variant (can have multiple price types)
CREATE TABLE variant_prices (
    id SERIAL PRIMARY KEY,
    variant_id INT REFERENCES product_variants(id) ON DELETE CASCADE NOT NULL,
    price_type VARCHAR(50) DEFAULT 'regular', -- 'regular', 'sale', 'wholesale', 'member'
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    mrp_price DECIMAL(10,2) NULL CHECK (compare_at_price >= 0), -- Original/Compare price
    cost_price DECIMAL(10,2) NULL CHECK (cost_price >= 0), -- Cost for profit calculation
    currency VARCHAR(3) DEFAULT 'NPR',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Ensure one active price per type per variant at a time
    UNIQUE(variant_id, price_type, is_active) WHERE is_active = TRUE,
    
    -- Indexes for performance
    INDEX idx_prices_variant (variant_id),
    INDEX idx_prices_active (is_active),
   
);

-- Price rules for dynamic pricing based on attributes
CREATE TABLE price_rules (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    attribute_id INT REFERENCES product_attributes(id),
    attribute_value_id INT REFERENCES attribute_values(id),
    price_adjustment_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'percentage', 'multiplier'
    price_adjustment DECIMAL(10,2) NOT NULL, -- +10, -5, +10%
    apply_to_base_price BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0, -- Higher priority rules apply first
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ======================
-- 5. INVENTORY & MEDIA
-- ======================

-- Inventory per variant
CREATE TABLE variant_inventory (
    id SERIAL PRIMARY KEY,
    variant_id INT REFERENCES product_variants(id) ON DELETE CASCADE UNIQUE,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    low_stock_threshold INT DEFAULT 10,
    is_in_stock BOOLEAN GENERATED ALWAYS AS (quantity > 0) STORED,
    last_restocked TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_inventory_updated_at 
    BEFORE UPDATE ON variant_inventory 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Media (images) per variant
CREATE TABLE variant_media (
    id SERIAL PRIMARY KEY,
    variant_id INT REFERENCES product_variants(id) ON DELETE CASCADE,
    media_type VARCHAR(50) DEFAULT 'image', -- 'image', 'video', '3d_model'
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for performance
    INDEX idx_variant_media (variant_id)
);

-- ======================
-- 6. VIEWS FOR EASY QUERYING
-- ======================

-- View for complete variant details
CREATE VIEW product_variant_details AS
SELECT 
    p.id AS product_id,
    p.sku AS master_sku,
    p.name AS product_name,
    v.id AS variant_id,
    v.sku AS variant_sku,
    v.is_default_variant,
    v.is_active AS variant_active,
    va.attribute_id,
    attr.name AS attribute_name,
    av.value AS attribute_value,
    av.display_value AS attribute_display_value,
    av.color_hex,
    vp.price_type,
    vp.price,
    vp.compare_at_price,
    vp.currency,
    vi.quantity,
    vi.is_in_stock,
    vm.url AS primary_image
FROM products p
JOIN product_variants v ON p.id = v.product_id
LEFT JOIN variant_attributes va ON v.id = va.variant_id
LEFT JOIN product_attributes attr ON va.attribute_id = attr.id
LEFT JOIN attribute_values av ON va.attribute_value_id = av.id
LEFT JOIN variant_prices vp ON v.id = vp.variant_id 
    AND vp.is_active = TRUE 
    AND (vp.valid_until IS NULL OR vp.valid_until > CURRENT_TIMESTAMP)
LEFT JOIN variant_inventory vi ON v.id = vi.variant_id
LEFT JOIN variant_media vm ON v.id = vm.variant_id AND vm.is_primary = TRUE
WHERE p.is_active = TRUE AND v.is_active = TRUE;

-- View for product catalog with variant summaries
CREATE VIEW product_catalog AS
SELECT 
    p.*,
    COUNT(DISTINCT v.id) AS variant_count,
    MIN(vp.price) AS min_price,
    MAX(vp.price) AS max_price,
    BOOL_OR(vi.is_in_stock) AS in_stock,
    STRING_AGG(DISTINCT attr.name || ': ' || av.display_value, ', ') AS available_variants
FROM products p
LEFT JOIN product_variants v ON p.id = v.product_id AND v.is_active = TRUE
LEFT JOIN variant_prices vp ON v.id = vp.variant_id 
    AND vp.is_active = TRUE 
    AND vp.price_type = 'regular'
    AND (vp.valid_until IS NULL OR vp.valid_until > CURRENT_TIMESTAMP)
LEFT JOIN variant_inventory vi ON v.id = vi.variant_id
LEFT JOIN variant_attributes va ON v.id = va.variant_id
LEFT JOIN attribute_values av ON va.attribute_value_id = av.id
LEFT JOIN product_attributes attr ON va.attribute_id = attr.id
WHERE p.is_active = TRUE
GROUP BY p.id;

-- ======================
-- 7. FUNCTIONS & PROCEDURES
-- ======================

-- Function to get current price for a variant
CREATE OR REPLACE FUNCTION get_variant_price(
    p_variant_id INT,
    p_price_type VARCHAR DEFAULT 'regular'
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_price DECIMAL(10,2);
BEGIN
    SELECT price INTO v_price
    FROM variant_prices
    WHERE variant_id = p_variant_id
        AND price_type = p_price_type
        AND is_active = TRUE
        AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)
    ORDER BY valid_from DESC
    LIMIT 1;
    
    RETURN COALESCE(v_price, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to create a new variant with attributes
CREATE OR REPLACE FUNCTION create_product_variant(
    p_product_id INT,
    p_sku VARCHAR,
    p_attributes JSONB, -- {"size": "M", "color": "Blue"}
    p_price DECIMAL(10,2),
    p_quantity INT DEFAULT 0
) RETURNS INT AS $$
DECLARE
    v_variant_id INT;
    attr_key TEXT;
    attr_value TEXT;
    v_attribute_id INT;
    v_attribute_value_id INT;
BEGIN
    -- Create variant
    INSERT INTO product_variants (product_id, sku)
    VALUES (p_product_id, p_sku)
    RETURNING id INTO v_variant_id;
    
    -- Add attributes
    FOR attr_key, attr_value IN SELECT * FROM jsonb_each_text(p_attributes)
    LOOP
        -- Get attribute ID
        SELECT id INTO v_attribute_id
        FROM product_attributes 
        WHERE slug = attr_key;
        
        -- Get or create attribute value
        INSERT INTO attribute_values (attribute_id, value, display_value)
        VALUES (
            v_attribute_id, 
            attr_value, 
            INITCAP(attr_value)
        )
        ON CONFLICT (attribute_id, value) 
        DO UPDATE SET id = EXCLUDED.id
        RETURNING id INTO v_attribute_value_id;
        
        -- Link variant to attribute value
        INSERT INTO variant_attributes (variant_id, attribute_id, attribute_value_id)
        VALUES (v_variant_id, v_attribute_id, v_attribute_value_id);
    END LOOP;
    
    -- Add price
    INSERT INTO variant_prices (variant_id, price_type, price)
    VALUES (v_variant_id, 'regular', p_price);
    
    -- Add inventory
    INSERT INTO variant_inventory (variant_id, quantity)
    VALUES (v_variant_id, p_quantity);
    
    RETURN v_variant_id;
END;
$$ LANGUAGE plpgsql;



