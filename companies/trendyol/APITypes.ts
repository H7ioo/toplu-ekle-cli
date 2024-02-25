export interface TrendyolCategoryAttr {
  id: number;
  name: string;
  displayName: string;
  categoryAttributes?: CategoryAttributesEntity[] | null;
}
interface CategoryAttributesEntity {
  allowCustom: boolean;
  attribute: AttributeOrAttributeValuesEntity;
  attributeValues?: (AttributeOrAttributeValuesEntity1 | null)[] | null;
  categoryId: number;
  required: boolean;
  varianter: boolean;
  slicer: boolean;
}
interface AttributeOrAttributeValuesEntity {
  id: number;
  name: string;
}
interface AttributeOrAttributeValuesEntity1 {
  id: number;
  name: string;
}
