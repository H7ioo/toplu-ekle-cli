import { z } from "zod";
import {
  CaseStand_ColorProductType,
  CaseStand_ColorVariant,
} from "./variables";
import { HepsiburadaMainOptionsFieldsScheme } from "../types";
import { CableProtector_ProdcutTypes } from "../../trendyol/cableProtector/variables";
export const CaseStandOptionsScheme = z.object({
  colors: z.array(z.enum(CaseStand_ColorProductType)),
  options: z.array(z.string()),
  productType: z.enum(CableProtector_ProdcutTypes),
  productKnownBrandName: z.string(),
});

/**
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Diğer Telefon Aksesuarları
 */
export type CaseStandOptions = z.infer<typeof CaseStandOptionsScheme>;

export const CaseStandFieldsScheme = z

  .object({
    Renk: z.enum(CaseStand_ColorProductType),
    Seçenek: z.string(),
    Renk2: z.enum(CaseStand_ColorVariant),
  })
  .merge(HepsiburadaMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Diğer Telefon Aksesuarları
 */
export type CaseStandFieldsOptions = z.infer<typeof CaseStandFieldsScheme>;
