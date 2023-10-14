import { z } from "zod";
import {
  CaseStand_GuaranteePeriods,
  CaseStand_StandProperties,
  CaseStand_Type,
} from "./variables";
import { TrendyolMainOptionsFieldsScheme } from "../types";
export const CaseStandOptionsScheme = z.object({
  colors: z.array(z.string()),
  standProperty: z.enum(CaseStand_StandProperties).optional(),
  guaranteePeriod: z.enum(CaseStand_GuaranteePeriods),
  standType: z.enum(CaseStand_Type).optional(),
});

/**
 * @CategoryName Araç İçi Telefon Tutucu Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Araç İçi Telefon Tutucu
 * @Category 1056
 */
export type CaseStandOptions = z.infer<typeof CaseStandOptionsScheme>;

export const CaseStandFieldsScheme = z

  .object({
    Kategori: z.literal(1056),
    "Telefon Tutucu Özellikleri": z.enum([...CaseStand_StandProperties, ""]),
    Renk: z.string(),
    "Garanti Süresi": z.enum([...CaseStand_GuaranteePeriods]),
    Türü: z.enum([...CaseStand_Type, ""]),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Araç İçi Telefon Tutucu Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Araç İçi Telefon Tutucu
 * @Category 1056
 */
export type CaseStandFieldsOptions = z.infer<typeof CaseStandFieldsScheme>;
