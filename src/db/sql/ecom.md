## Key Design Principles:

### 1. **Flexible Attribute System**

-   Generic attributes table for any product type
-   Support for different attribute types (text, color, image)
-   Easy to add new attributes without schema changes

### 2. **Price Management**

-   Multiple price types (regular, sale, wholesale)
-   Price rules for attribute-based adjustments
-   Time-based pricing with valid from/until dates

### 3. **Inventory Tracking**

-   Separate inventory per variant
-   Low stock thresholds
-   Real-time stock status

### 4. **Performance Optimizations**

-   Views for common queries
-   Strategic indexes
-   Functions for complex operations

### 5. **Data Integrity**

-   Foreign key constraints
-   Unique constraints
-   Check constraints for business rules

## Example Use Cases:

### Case 1: T-Shirt with Size & Color

```sql
-- Product: T-Shirt
-- Attributes: Size (S, M, L, XL), Color (Red, Blue, Black)
-- Variants: Red-S, Red-M, Blue-S, Blue-M, etc.
-- Different prices for different sizes
```

### Case 2: Beauty Product with Volume

```sql
-- Product: Cetaphil Face Wash
-- Attributes: Volume (100ml, 200ml, 500ml)
-- Price increases with volume
-- All variants share same product details
```

### Case 3: Furniture with Material

```sql
-- Product: Wooden Chair
-- Attributes: Wood Type (Oak, Pine, Walnut), Finish (Matte, Glossy)
-- Price varies by wood type
-- Inventory tracked per variant
```

This schema is:

-   **Normalized**: Minimal data redundancy
-   **Extensible**: Easy to add new attribute types
-   **Performant**: Optimized for e-commerce queries
-   **Scalable**: Can handle thousands of products with variants
-   **Maintainable**: Clear relationships and constraints

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
