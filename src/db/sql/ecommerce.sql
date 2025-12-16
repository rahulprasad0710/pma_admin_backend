-- ======================
-- 8. SAMPLE DATA
-- ======================

-- Insert sample attributes
INSERT INTO product_attributes (name, slug, display_name, attribute_type) VALUES
('Size', 'size', 'Size', 'text'),
('Color', 'color', 'Color', 'color'),
('Material', 'material', 'Material', 'text');

-- Insert attribute values
-- For Size
INSERT INTO attribute_values (attribute_id, value, display_value, display_order) VALUES
(1, 'S', 'Small', 1),
(1, 'M', 'Medium', 2),
(1, 'L', 'Large', 3),
(1, 'XL', 'Extra Large', 4);

-- For Color
INSERT INTO attribute_values (attribute_id, value, display_value, color_hex, display_order) VALUES
(2, 'red', 'Red', '#FF0000', 1),
(2, 'blue', 'Blue', '#0000FF', 2),
(2, 'black', 'Black', '#000000', 3),
(2, 'white', 'White', '#FFFFFF', 4);

-- Create a product with variants
-- 1. Create master product
INSERT INTO products (sku, name, slug, description, is_variant_product) VALUES
('TSHIRT001', 'Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'High quality cotton t-shirt', TRUE);

-- 2. Create variants using the function
SELECT create_product_variant(
    1, -- product_id
    'TSHIRT001-RED-M', -- sku
    '{"size": "M", "color": "red"}', -- attributes
    29.99, -- price
    100 -- quantity
);

SELECT create_product_variant(
    1,
    'TSHIRT001-BLUE-M',
    '{"size": "M", "color": "blue"}',
    29.99,
    50
);

SELECT create_product_variant(
    1,
    'TSHIRT001-RED-L',
    '{"size": "L", "color": "red"}',
    32.99, -- Larger size costs more
    75
);

-- ======================
-- 9. QUERY EXAMPLES
-- ======================

-- Get all variants for a product with prices
SELECT 
    v.sku,
    jsonb_object_agg(pa.name, av.display_value) as attributes,
    vp.price,
    vi.quantity,
    vm.url as image
FROM product_variants v
JOIN variant_attributes va ON v.id = va.variant_id
JOIN product_attributes pa ON va.attribute_id = pa.id
JOIN attribute_values av ON va.attribute_value_id = av.id
LEFT JOIN variant_prices vp ON v.id = vp.variant_id 
    AND vp.price_type = 'regular' 
    AND vp.is_active = TRUE
LEFT JOIN variant_inventory vi ON v.id = vi.variant_id
LEFT JOIN variant_media vm ON v.id = vm.variant_id AND vm.is_primary = TRUE
WHERE v.product_id = 1
GROUP BY v.id, v.sku, vp.price, vi.quantity, vm.url;

-- Get product with all variants in JSON format
SELECT 
    p.name,
    p.description,
    jsonb_agg(
        jsonb_build_object(
            'variant_id', v.id,
            'sku', v.sku,
            'attributes', (
                SELECT jsonb_object_agg(pa.name, av.display_value)
                FROM variant_attributes va2
                JOIN product_attributes pa ON va2.attribute_id = pa.id
                JOIN attribute_values av ON va2.attribute_value_id = av.id
                WHERE va2.variant_id = v.id
            ),
            'price', vp.price,
            'in_stock', vi.is_in_stock
        )
    ) as variants
FROM products p
LEFT JOIN product_variants v ON p.id = v.product_id
LEFT JOIN variant_prices vp ON v.id = vp.variant_id AND vp.is_active = TRUE
LEFT JOIN variant_inventory vi ON v.id = vi.variant_id
WHERE p.id = 1
GROUP BY p.id, p.name, p.description;

-- Find variants by specific attributes
SELECT 
    v.id,
    v.sku,
    get_variant_price(v.id) as price
FROM product_variants v
WHERE v.product_id = 1
AND EXISTS (
    SELECT 1 
    FROM variant_attributes va
    JOIN attribute_values av ON va.attribute_value_id = av.id
    WHERE va.variant_id = v.id 
    AND av.value = 'red' -- Color = red
)
AND EXISTS (
    SELECT 1 
    FROM variant_attributes va
    JOIN attribute_values av ON va.attribute_value_id = av.id
    WHERE va.variant_id = v.id 
    AND av.value = 'M' -- Size = M
);

-- ======================
-- 10. INDEXES FOR PERFORMANCE
-- ======================

-- Additional indexes for query optimization
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_prices_variant_type ON variant_prices(variant_id, price_type);
CREATE INDEX idx_inventory_stock ON variant_inventory(is_in_stock);
CREATE INDEX idx_products_slug ON products(slug);

-- Composite index for variant attribute queries
CREATE INDEX idx_variant_attr_composite ON variant_attributes(variant_id, attribute_id, attribute_value_id);

-- Full text search on product names and descriptions
CREATE INDEX idx_products_search ON products USING gin(
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
);

-- ======================
-- 11. CONSTRAINTS & VALIDATIONS
-- ======================

-- Ensure price history doesn't have overlapping active periods
-- This would require a more complex trigger

-- Ensure variant SKUs are unique across products
-- Already enforced by UNIQUE constraint

-- Ensure only one default variant per product
CREATE UNIQUE INDEX unique_default_variant 
ON product_variants(product_id, is_default_variant) 
WHERE is_default_variant = TRUE;

-- ======================
-- 12. PARTITIONING (For large datasets)
-- ======================

-- If you have millions of variants, consider partitioning
-- Example: Partition variant_prices by year

-- CREATE TABLE variant_prices_2024 PARTITION OF variant_prices
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```



