import { z } from "zod";
import { TrendyolMainOptionsFieldsScheme } from "../types";
import {
  CableProtector_GuaranteePeriods,
  CableProtector_GuaranteeTypes,
  CableProtector_ProdcutTypes,
} from "./variables";

export const CableProtectorOptionsScheme = z.object({
  colors: z.array(z.string()),
  guaranteeType: z.enum(CableProtector_GuaranteeTypes).optional(),
  guaranteePeriod: z.enum(CableProtector_GuaranteePeriods),
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
    "Garanti Tipi": z.enum([...CableProtector_GuaranteeTypes, ""]),
    "Garanti Süresi": z.enum(CableProtector_GuaranteePeriods),
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
