import { AttributeValue } from "../../../db/entity/ecommerce/AttributeValue";
import { ProductAttribute } from "../../../db/entity/ecommerce/Attribute";
import dataSource from "../../../db/data-source";

type TCreateAttributePayload = {
    name: string;
    display_order: number;
    is_filterable: boolean;
    is_variant_attribute: boolean;
    attribute_type?: string;
};

type TCreateAttributeValuesPayload = {
    value: string;
    display_value?: string;
    color_hex?: string;
    display_order: number;
    image_url_id?: number;
    attributeId: number;
};

export class ProductAttributeService {
    private attributeRepo = dataSource.getRepository(ProductAttribute);
    private attributeValueRepo = dataSource.getRepository(AttributeValue);

    async createAttribute(
        payload: TCreateAttributePayload
    ): Promise<ProductAttribute> {
        const {
            name,
            attribute_type,
            display_order,
            is_filterable,
            is_variant_attribute,
        } = payload;
        const data = new ProductAttribute();
        data.name = name;
        data.attribute_type = attribute_type ?? "TEXT";
        data.display_order = display_order;
        data.is_filterable = is_filterable;
        data.is_variant_attribute = is_variant_attribute;

        const result = await this.attributeRepo.save(data);
        return result;
    }

    async createAttributeValue(
        payload: TCreateAttributeValuesPayload
    ): Promise<AttributeValue> {
        const { attributeId, value, display_value, display_order, color_hex } =
            payload;

        // Create entity
        const data = new AttributeValue();
        data.product_attribute_id = attributeId;
        data.value = value;
        data.display_value = display_value ?? value;
        data.display_order = display_order ?? 0;
        if (color_hex) data.color_hex = color_hex;

        // Save
        const result = await this.attributeValueRepo.save(data);
        return result;
    }

    public async createAttributeValueAll(
        payload: TCreateAttributeValuesPayload[]
    ): Promise<AttributeValue[]> {
        const result = await Promise.all(
            payload.map(async (item) => {
                return await this.createAttributeValue(item);
            })
        );
        return result;
    }
}
