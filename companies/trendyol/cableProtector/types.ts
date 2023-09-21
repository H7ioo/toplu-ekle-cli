import { z } from "zod";
import { TrendyolMainOptionsFieldsScheme } from "../types";
import {
  CableProtector_GuranteePeriods,
  CableProtector_GuranteeTypes,
  CableProtector_ProdcutTypes,
} from "./variables";

export const CableProtectorOptionsScheme = z.object({
  colors: z.array(z.string()),
  guranteeType: z.enum(CableProtector_GuranteeTypes).optional(),
  guranteePeriod: z.enum(CableProtector_GuranteePeriods),
  productType: z.enum(CableProtector_ProdcutTypes),
  productKnownBrandName: z.string(),
});
/**
 * @CategoryName Kablo Aksesuarları Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Şarj Kabloları > Kablo Aksesuarları
 * @Category 5505
 */
export type CableProtectorOptions = z.infer<typeof CableProtectorOptionsScheme>;

export const CableProtectorFieldsScheme = z

  .object({
    Kategori: z.literal(5505),
    "Garanti Tipi": z.enum([...CableProtector_GuranteeTypes, ""]),
    "Garanti Süresi": z.enum(CableProtector_GuranteePeriods),
    "Ürün Tipi": z.enum([...CableProtector_ProdcutTypes]),
    Renk: z.string(),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Kablo Aksesuarları Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Şarj Kabloları > Kablo Aksesuarları
 * @Category 5505
 */
export type CableProtectorFieldsOptions = z.infer<
  typeof CableProtectorFieldsScheme
>;
