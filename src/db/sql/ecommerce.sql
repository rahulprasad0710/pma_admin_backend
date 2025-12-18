--  ecommerce_categories STARTS 

INSERT INTO ecommerce_categories (title, slug,url, description, thumbnail_id, cover_pic_id ,display_order, is_active ) VALUES
('Decor', 'decor', '/decor','Home decoration items', NULL, NULL, 1,1),
('Kitchen Items', 'kitchen-items','/kitchen-items', 'Kitchen utensils and accessories', NULL, NULL, 2,1),
('Beauty', 'beauty', '/beauty','Beauty and skincare products', NULL, NULL , 3 ,1);


--  ecommerce_categories ENDS 

-- Insert Subcategories
INSERT INTO ecommerce_subcategories 
(category_id, title, slug, url, description, thumbnail_id, cover_pic_id, display_order, is_active) 
VALUES
(1, 'Ply Decor', 'ply-decor', '/subcategories/ply-decor',
 'Decorative plywood products for modern and traditional interiors.',
 NULL, NULL, 1, 1),

(1, 'Flower Pot', 'flower-pot', '/subcategories/flower-pot',
 'Stylish flower pots suitable for indoor and outdoor gardening.',
 NULL, NULL, 1, 1),

(2, 'Utensils', 'utensils', '/subcategories/utensils',
 'Essential kitchen utensils for everyday cooking needs.',
 NULL, NULL, 1, 1),

(2, 'Cookware', 'cookware', '/subcategories/cookware',
 'Durable and high-quality cookware for efficient cooking.',
 NULL, NULL, 1, 1),

(3, 'Face Wash', 'face-wash', '/subcategories/face-wash',
 'Gentle face washes designed to cleanse and refresh your skin.',
 NULL, NULL, 1, 1),

(3, 'Moisturizer', 'moisturizer', '/subcategories/moisturizer',
 'Hydrating moisturizers to keep your skin soft and healthy.',
 NULL, NULL, 1, 1),

(3, 'Serum', 'serum', '/subcategories/serum',
 'Skin care serums formulated to nourish and rejuvenate skin.',
 NULL, NULL, 1, 1);


-- Insert Subcategories ENDS 



INSERT INTO ecommerce_brands
(category_id, title, slug, description, thumbnail_id, cover_pic_id, display_order, is_featured, is_active)
VALUES
(3, 'Cetaphil', 'cetaphil',
 'Gentle skincare products formulated for sensitive skin.',
 NULL, NULL, 1, 0, 1),

(3, 'Neutrogena', 'neutrogena',
 'Dermatologist-recommended skincare and cosmetic solutions.',
 NULL, NULL, 2, 0, 1),

(3, 'La Roche-Posay', 'la-roche-posay',
 'Advanced skincare solutions for sensitive and acne-prone skin.',
 NULL, NULL, 3, 0, 1),

(3, 'CeraVe', 'cerave',
 'Skincare products enriched with essential ceramides.',
 NULL, NULL, 4, 0, 1),

(3, 'The Ordinary', 'the-ordinary',
 'Clinical formulations with integrity and transparency.',
 NULL, NULL, 5, 1, 1) ,
 (1, 'CozyMuse', 'CozyMuse',
 'Locally made with love and warmth',
 NULL, NULL, 6, 1, 1);


-- ========================================
-- PRODUCTS FOR DECOR CATEGORY
-- ========================================

-- 1. Ply Decor Products (max 20 products)
INSERT INTO ecommerce_products 
(sku, title, name, slug, description, category_id, sub_category_id, brand_id, thumbnail_id, cover_pic_id, main_pic, is_featured, is_active, is_variant_product) 
VALUES

-- Ply Decor Items (Simple products - no variants)
('PDEC001', 'Handcrafted Wooden Wall Art', 'Wooden Wall Art Geometric', 'wooden-wall-art-geometric',
 'Beautiful geometric wall art made from premium plywood, perfect for modern interiors.',
 1, 2, 6, NULL, NULL, NULL, 1, 1, 0),

('PDEC002', 'Plywood Floating Shelves', 'Floating Shelves Set of 3', 'plywood-floating-shelves',
 'Set of 3 floating shelves made from high-quality plywood, easy to install.',
 1, 2, 6, NULL, NULL, NULL, 0, 1, 0),

('PDEC003', 'Minimalist Plywood Clock', 'Minimalist Wall Clock', 'minimalist-plywood-clock',
 'Minimalist design wall clock crafted from fine plywood with silent movement.',
 1, 2, 6, NULL, NULL, NULL, 1, 1, 0),

('PDEC004', 'Plywood Photo Frames Set', 'Photo Frames Set of 5', 'plywood-photo-frames',
 'Set of 5 assorted size photo frames made from sustainable plywood.',
 1, 2, 6, NULL, NULL, NULL, 0, 1, 0),

('PDEC005', 'Plywood Jewelry Box', 'Handmade Jewelry Organizer', 'plywood-jewelry-box',
 'Handcrafted jewelry box with multiple compartments and velvet lining.',
 1, 2, 6, NULL, NULL, NULL, 0, 1, 0),

-- Flower Pot Items (Some with variants for size/color)
('FPOT001', 'Ceramic Plant Pot', 'Ceramic Flower Pot - Small', 'ceramic-flower-pot-small',
 'Beautiful ceramic plant pot for indoor plants, includes drainage hole.',
 1, 3, 6, NULL, NULL, NULL, 1, 1, 1),

('FPOT002', 'Hanging Macrame Plant Holder', 'Macrame Plant Hanger', 'macrame-plant-hanger',
 'Handwoven macrame plant hanger with wooden beads, perfect for hanging plants.',
 1, 3, 6, NULL, NULL, NULL, 0, 1, 0),

('FPOT003', 'Terracotta Pot Set', 'Terracotta Pots Set of 6', 'terracotta-pots-set',
 'Set of 6 unglazed terracotta pots in assorted sizes for garden plants.',
 1, 3, 6, NULL, NULL, NULL, 0, 1, 0),

('FPOT004', 'Self-Watering Plant Pot', 'Self-Watering Planter', 'self-watering-planter',
 'Modern self-watering planter with water level indicator for busy plant lovers.',
 1, 3, 6, NULL, NULL, NULL, 1, 1, 1),

('FPOT005', 'Decorative Ceramic Pot', 'Ceramic Pot with Pattern', 'decorative-ceramic-pot',
 'Ornate ceramic pot with hand-painted patterns, perfect for home decor.',
 1, 3, 6, NULL, NULL, NULL, 0, 1, 0),

-- More Decor items to reach near max 20
('PDEC006', 'Plywood Bookends', 'Geometric Bookends Pair', 'plywood-bookends',
 'Pair of geometric design bookends made from solid plywood.',
 1, 2, 6, NULL, NULL, NULL, 0, 1, 0),

('PDEC007', 'Wall Mounted Coat Rack', 'Minimalist Coat Rack', 'wall-mounted-coat-rack',
 'Wall mounted coat rack with 5 hooks, made from birch plywood.',
 1, 2, 6, NULL, NULL, NULL, 0, 1, 0),

('FPOT006', 'Glass Terrarium', 'Glass Plant Terrarium', 'glass-terrarium',
 'Hand-blown glass terrarium for succulents and air plants.',
 1, 3, 6, NULL, NULL, NULL, 0, 1, 0),

('PDEC008', 'Plywood Serving Tray', 'Wooden Serving Tray', 'plywood-serving-tray',
 'Lightweight serving tray with handles, perfect for breakfast in bed.',
 1, 2, 6, NULL, NULL, NULL, 0, 1, 0);

-- ========================================
-- PRODUCTS FOR KITCHEN ITEMS CATEGORY
-- ========================================

INSERT INTO ecommerce_products 
(sku, title, name, slug, description, category_id, sub_category_id, brand_id, thumbnail_id, cover_pic_id, main_pic, is_featured, is_active, is_variant_product) 
VALUES

-- Utensils (Some with variants for material/size)
('KUT001', 'Silicone Cooking Utensils Set', 'Silicone Utensil Set 5-Piece', 'silicone-utensils-set',
 'Heat-resistant silicone cooking utensils set, non-stick friendly.',
 2, 3, NULL, NULL, NULL, NULL, 1, 1, 1),

('KUT002', 'Wooden Spoon Set', 'Wooden Cooking Spoons Set', 'wooden-spoon-set',
 'Set of 4 wooden spoons made from sustainable bamboo, different sizes.',
 2, 3, NULL, NULL, NULL, NULL, 0, 1, 0),

('KUT003', 'Stainless Steel Measuring Spoons', 'Measuring Spoons Set', 'stainless-measuring-spoons',
 'Set of 6 stainless steel measuring spoons on a ring for easy storage.',
 2, 3, NULL, NULL, NULL, NULL, 0, 1, 0),

('KUT004', 'Nylon Spatula Set', 'Nylon Kitchen Spatulas', 'nylon-spatula-set',
 'Set of 3 nylon spatulas, safe for non-stick cookware.',
 2, 3, NULL, NULL, NULL, NULL, 0, 1, 0),

-- Cookware (Mostly simple products)
('KCP001', 'Non-Stick Frying Pan', 'Ceramic Non-Stick Pan', 'non-stick-frying-pan',
 'Ceramic non-stick frying pan, PFOA free, 10-inch diameter.',
 2, 4, NULL, NULL, NULL, NULL, 1, 1, 1),

('KCP002', 'Stainless Steel Saucepan', 'Steel Saucepan 2QT', 'stainless-steel-saucepan',
 '2-quart stainless steel saucepan with glass lid and stay-cool handle.',
 2, 4, NULL, NULL, NULL, NULL, 0, 1, 0),

('KCP003', 'Cast Iron Skillet', 'Pre-Seasoned Cast Iron', 'cast-iron-skillet',
 'Pre-seasoned cast iron skillet, excellent heat retention, 12-inch.',
 2, 4, NULL, NULL, NULL, NULL, 1, 1, 0),

('KCP004', 'Non-Stick Cookware Set', '8-Piece Cookware Set', 'non-stick-cookware-set',
 'Complete 8-piece non-stick cookware set for your kitchen.',
 2, 4, NULL, NULL, NULL, NULL, 0, 1, 1),

-- Storage Items
('KST001', 'Glass Food Storage Containers', 'Glass Container Set', 'glass-food-containers',
 'Set of 10 glass food storage containers with bamboo lids.',
 2, 5, NULL, NULL, NULL, NULL, 1, 1, 0),

('KST002', 'Silicone Food Bags', 'Reusable Silicone Bags', 'silicone-food-bags',
 'Set of 5 reusable silicone storage bags, dishwasher safe.',
 2, 5, NULL, NULL, NULL, NULL, 0, 1, 0),

('KST003', 'Stackable Plastic Containers', 'Plastic Storage Set', 'stackable-plastic-containers',
 'Set of 15 stackable plastic containers with locking lids.',
 2, 5, NULL, NULL, NULL, NULL, 0, 1, 0),

-- More Kitchen items to reach max 20
('KUT005', 'Garlic Press', 'Stainless Steel Garlic Press', 'stainless-garlic-press',
 'Heavy-duty stainless steel garlic press with cleaner.',
 2, 3, NULL, NULL, NULL, NULL, 0, 1, 0),

('KCP005', 'Stock Pot', 'Large Aluminum Stock Pot', 'aluminum-stock-pot',
 '8-quart aluminum stock pot with lid, perfect for soups and stews.',
 2, 4, NULL, NULL, NULL, NULL, 0, 1, 0),

('KST004', 'Spice Jar Set', 'Glass Spice Jars with Labels', 'glass-spice-jars',
 'Set of 12 glass spice jars with wooden lids and chalkboard labels.',
 2, 5, NULL, NULL, NULL, NULL, 0, 1, 0),

('KUT006', 'Chef Knife', '8-Inch Chef Knife', '8-inch-chef-knife',
 'Professional 8-inch chef knife with ergonomic handle.',
 2, 3, NULL, NULL, NULL, NULL, 1, 1, 0),

('KCP006', 'Baking Sheet Set', 'Non-Stick Baking Sheets', 'non-stick-baking-sheets',
 'Set of 3 non-stick baking sheets in different sizes.',
 2, 4, NULL, NULL, NULL, NULL, 0, 1, 0),

('KST005', 'Cereal Dispenser', 'Cereal Storage Container', 'cereal-dispenser',
 'Large capacity cereal dispenser with airtight seal.',
 2, 5, NULL, NULL, NULL, NULL, 0, 1, 0),

('KUT007', 'Pepper Mill', 'Adjustable Pepper Grinder', 'adjustable-pepper-mill',
 'Ceramic grinder with adjustable coarseness settings.',
 2, 3, NULL, NULL, NULL, NULL, 0, 1, 0),

('KCP007', 'Muffin Pan', 'Non-Stick Muffin Pan', 'non-stick-muffin-pan',
 '12-cup non-stick muffin pan for perfect baking.',
 2, 4, NULL, NULL, NULL, NULL, 0, 1, 0);

-- ========================================
-- PRODUCTS FOR BEAUTY CATEGORY (Cetaphil - 10 types as requested)
-- ========================================

INSERT INTO ecommerce_products 
(sku, title, name, slug, description, category_id, sub_category_id, brand_id, thumbnail_id, cover_pic_id, main_pic, is_featured, is_active, is_variant_product) 
VALUES

-- CETAPHIL PRODUCTS (10 types - mostly with variants for size)
-- Face Wash Category
('CTFW001', 'Cetaphil Gentle Skin Cleanser', 'Gentle Skin Cleanser', 'cetaphil-gentle-skin-cleanser',
 'Gentle, non-irritating cleanser ideal for sensitive skin. Dermatologist recommended.',
 3, 6, 1, NULL, NULL, NULL, 1, 1, 1),

('CTFW002', 'Cetaphil Daily Facial Cleanser', 'Daily Facial Cleanser', 'cetaphil-daily-facial-cleanser',
 'Oil-free formula removes dirt, oil, and makeup without over-drying.',
 3, 6, 1, NULL, NULL, NULL, 0, 1, 1),

('CTFW003', 'Cetaphil Pro Dermacontrol Foam Wash', 'Foam Wash for Oily Skin', 'cetaphil-foam-wash',
 'Foaming cleanser specifically formulated for oily, acne-prone skin.',
 3, 6, 1, NULL, NULL, NULL, 1, 1, 1),

-- Moisturizer Category
('CTMZ001', 'Cetaphil Moisturizing Cream', 'Moisturizing Cream', 'cetaphil-moisturizing-cream',
 'Rich, non-greasy formula for very dry, sensitive skin. 24-hour hydration.',
 3, 7, 1, NULL, NULL, NULL, 1, 1, 1),

('CTMZ002', 'Cetaphil Daily Hydrating Lotion', 'Daily Hydrating Lotion', 'cetaphil-daily-hydrating-lotion',
 'Lightweight lotion with hyaluronic acid for all-day hydration.',
 3, 7, 1, NULL, NULL, NULL, 0, 1, 1),

('CTMZ003', 'Cetaphil PRO Dermacontrol Moisturizer SPF 30', 'Oil Control Moisturizer SPF 30', 'cetaphil-spf-moisturizer',
 'Mattifying moisturizer with SPF 30 for oily, acne-prone skin.',
 3, 7, 1, NULL, NULL, NULL, 1, 1, 1),

-- Serum Category
('CTSR001', 'Cetaphil Healthy Renew Retinol Serum', 'Retinol Serum', 'cetaphil-retinol-serum',
 'Anti-aging serum with retinol complex to reduce fine lines and wrinkles.',
 3, 8, 1, NULL, NULL, NULL, 1, 1, 1),

('CTSR002', 'Cetaphil Brightness Refresh Vitamin C Serum', 'Vitamin C Serum', 'cetaphil-vitamin-c-serum',
 'Brightening serum with Vitamin C to improve skin tone and texture.',
 3, 8, 1, NULL, NULL, NULL, 0, 1, 1),

('CTSR003', 'Cetaphil Hydration Boost Hyaluronic Acid Serum', 'Hyaluronic Acid Serum', 'cetaphil-hyaluronic-serum',
 'Intense hydration serum with hyaluronic acid for plump, dewy skin.',
 3, 8, 1, NULL, NULL, NULL, 0, 1, 1),

-- 10th Cetaphil Product
('CTFW004', 'Cetaphil Baby Wash & Shampoo', 'Baby Wash & Shampoo', 'cetaphil-baby-wash',
 'Extra gentle, tear-free formula for baby delicate skin and hair.',
 3, 6, 1, NULL, NULL, NULL, 0, 1, 1),

-- Other Brands Products (to complete the category)
('NTFW001', 'Neutrogena Hydro Boost Cleanser', 'Hydro Boost Cleanser', 'neutrogena-hydro-boost-cleanser',
 'Hydrating gel cleanser with hyaluronic acid for thirsty skin.',
 3, 6, 2, NULL, NULL, NULL, 0, 1, 1),

('LRPM001', 'La Roche-Posay Toleriane Moisturizer', 'Toleriane Double Repair', 'la-roche-posay-moisturizer',
 'Face moisturizer with prebiotic thermal water for sensitive skin.',
 3, 7, 3, NULL, NULL, NULL, 0, 1, 1),

('CRVS001', 'CeraVe Hydrating Hyaluronic Acid Serum', 'Hyaluronic Acid Serum', 'cerave-hyaluronic-serum',
 'Serum with hyaluronic acid, vitamin B5, and ceramides.',
 3, 8, 4, NULL, NULL, NULL, 0, 1, 1),

('ORD001', 'The Ordinary Niacinamide 10% + Zinc 1%', 'Niacinamide Serum', 'ordinary-niacinamide-serum',
 'High-strength vitamin and mineral formula for blemish-prone skin.',
 3, 8, 5, NULL, NULL, NULL, 1, 1, 0),

('NTFW002', 'Neutrogena Makeup Remover Cleanser', 'Makeup Remover Cleansing Towelettes', 'neutrogena-makeup-remover',
 'Pre-moistened cleansing towelettes that remove makeup and dirt.',
 3, 6, 2, NULL, NULL, NULL, 0, 1, 0),

('LRPM002', 'La Roche-Posay Anthelios Sunscreen', 'Anthelios SPF 50', 'la-roche-posay-sunscreen',
 'Lightweight sunscreen with SPF 50 for face and sensitive skin.',
 3, 7, 3, NULL, NULL, NULL, 1, 1, 0),

('CRVS002', 'CeraVe Foaming Facial Cleanser', 'Foaming Facial Cleanser', 'cerave-foaming-cleanser',
 'Foaming cleanser that removes excess oil without disrupting skin barrier.',
 3, 6, 4, NULL, NULL, NULL, 0, 1, 0),

('ORD002', 'The Ordinary AHA 30% + BHA 2% Peeling Solution', 'Chemical Peel Solution', 'ordinary-chemical-peel',
 'Exfoliating facial with alpha and beta hydroxy acids.',
 3, 8, 5, NULL, NULL, NULL, 1, 1, 0);