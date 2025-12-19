import { z } from "zod";

export const CreateProductAttributeSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Attribute name is required"),
        display_order: z.number().int().nonnegative().optional(),
        is_filterable: z.boolean().optional(),
        is_variant_attribute: z.boolean().optional(),
        attribute_type: z.enum(["TEXT", "NUMBER", "COLOR", "IMAGE"]).optional(),
    }),
});

export const CreateAttributeValueSchema = z.object({
    body: z.object({
        value: z.string().min(1, "Attribute value is required"),
        display_value: z.string().optional(),
        color_hex: z
            .string()
            .regex(/^#([0-9A-Fa-f]{6})$/, "Invalid HEX color")
            .optional(),
        display_order: z
            .number()
            .int()
            .nonnegative("Display order must be a non-negative integer"),
        image_url_id: z.number().int().positive().optional(),
        attributeId: z
            .number()
            .int()
            .positive("Attribute ID must be a positive integer"),
    }),
});

// Type inferred from schema
export type CreateProductAttributeSchema = z.infer<
    typeof CreateProductAttributeSchema
>["body"];

export type CreateAttributeValueSchema = z.infer<
    typeof CreateProductAttributeSchema
>["body"];
