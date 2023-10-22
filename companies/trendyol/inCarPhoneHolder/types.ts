import { z } from "zod";
import {
  InCarPhoneHolder_GuaranteePeriods,
  InCarPhoneHolder_StandProperties,
  InCarPhoneHolder_Type,
} from "./variables";
import { TrendyolMainOptionsFieldsScheme } from "../types";
export const InCarPhoneHolderOptionsScheme = z.object({
  colors: z.array(z.string()),
  standProperty: z.enum(InCarPhoneHolder_StandProperties).optional(),
  guaranteePeriod: z.enum(InCarPhoneHolder_GuaranteePeriods),
  standType: z.enum(InCarPhoneHolder_Type).optional(),
});

/**
 * @CategoryName Araç İçi Telefon Tutucu Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Araç İçi Telefon Tutucu
 * @Category 1056
 */
export type InCarPhoneHolderOptions = z.infer<
  typeof InCarPhoneHolderOptionsScheme
>;

export const InCarPhoneHolderFieldsScheme = z

  .object({
    Kategori: z.literal(1056),
    "Telefon Tutucu Özellikleri": z.enum([
      ...InCarPhoneHolder_StandProperties,
      "",
    ]),
    Renk: z.string(),
    "Garanti Süresi": z.enum([...InCarPhoneHolder_GuaranteePeriods]),
    Türü: z.enum([...InCarPhoneHolder_Type, ""]),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Araç İçi Telefon Tutucu Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Araç İçi Telefon Tutucu
 * @Category 1056
 */
export type InCarPhoneHolderFieldsOptions = z.infer<
  typeof InCarPhoneHolderFieldsScheme
>;
