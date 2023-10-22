import { z } from "zod";
import { InCarPhoneHolder_Colors, InCarPhoneHolder_Type } from "./variables";
import { HepsiburadaMainOptionsFieldsScheme } from "../types";
export const InCarPhoneHolderOptionsScheme = z.object({
  colors: z.array(z.enum([...InCarPhoneHolder_Colors])),
  standType: z.enum(InCarPhoneHolder_Type),
});

/**
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Araç İçi Telefon Tutucular > Araç İçi Telefon Tutacakları
 */
export type InCarPhoneHolderOptions = z.infer<
  typeof InCarPhoneHolderOptionsScheme
>;

export const InCarPhoneHolderFieldsScheme = z

  .object({
    Renk: z.enum([...InCarPhoneHolder_Colors, ""]),
    Türü: z.enum(InCarPhoneHolder_Type),
  })
  .merge(HepsiburadaMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Araç İçi Telefon Tutucular > Araç İçi Telefon Tutacakları
 */
export type InCarPhoneHolderFieldsOptions = z.infer<
  typeof InCarPhoneHolderFieldsScheme
>;
