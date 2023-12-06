import { z } from "zod";
import {
  LensProtector_ColorProductType,
  LensProtector_ColorVariant,
} from "./variables";
import { HepsiburadaMainOptionsFieldsScheme } from "../types";
import {
  PhoneCase_PhonesList,
  PhoneCase_PhonesListExtend,
} from "../phoneCase/variables";
export const LensProtectorOptionsScheme = z
  .object({
    colors: z.array(z.enum(LensProtector_ColorProductType)),
    options: z.array(z.string()),
    phonesList: z.array(
      z.enum([...PhoneCase_PhonesList, ...PhoneCase_PhonesListExtend])
    ),
    customPhonesList: z.array(z.string()),
    productKnownBrandName: z.string(),
  })
  .refine(({ phonesList, customPhonesList }) => {
    if (!phonesList && !customPhonesList) return false;
    return true;
  }, "One of the lists must exist");

/**
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Diğer Telefon Aksesuarları
 */
export type LensProtectorOptions = z.infer<typeof LensProtectorOptionsScheme>;

export const LensProtectorFieldsScheme = z

  .object({
    Renk: z.enum(LensProtector_ColorProductType),
    Seçenek: z.string(),
    Renk2: z.enum(LensProtector_ColorVariant),
  })
  .merge(HepsiburadaMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Diğer Telefon Aksesuarları
 */
export type LensProtectorFieldsOptions = z.infer<
  typeof LensProtectorFieldsScheme
>;
