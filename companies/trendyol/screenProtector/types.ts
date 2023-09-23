import { z } from "zod";
import {
  ScreenProtector_GuaranteePeriods,
  ScreenProtector_PhoneBrands,
  ScreenProtector_PhonesList,
  ScreenProtector_PhonesListExtend,
} from "./variables";
import { TrendyolMainOptionsFieldsScheme } from "../types";
export const ScreenProtectorOptionsScheme = z
  .object({
    phonesList: z.array(
      z.enum([
        ...ScreenProtector_PhonesList,
        ...ScreenProtector_PhonesListExtend,
      ])
    ),
    customPhonesList: z.array(z.string()),
    guaranteePeriod: z.enum(ScreenProtector_GuaranteePeriods),
    phoneBrand: z.enum(ScreenProtector_PhoneBrands).optional(),
    productKnownBrandName: z.string(),
  })
  .refine(({ phonesList, customPhonesList }) => {
    if (!phonesList && !customPhonesList) return false;
    return true;
  }, "One of the lists must exist");
/**
 * @CategoryName Ekran Koruyucu Film Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Ekran Koruyucu Film
 * @Category 2860
 */
export type ScreenProtectorOptions = z.infer<
  typeof ScreenProtectorOptionsScheme
>;

export const ScreenProtectorFieldsScheme = z

  .object({
    Kategori: z.literal(2860),
    "Cep Telefonu Modeli": z.enum([
      ...ScreenProtector_PhonesList,
      ...ScreenProtector_PhonesListExtend,
      "",
    ]),
    "Garanti Süresi": z.enum(ScreenProtector_GuaranteePeriods),
    "Uyumlu Marka": z.enum([...ScreenProtector_PhoneBrands, ""]),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Ekran Koruyucu Film Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Ekran Koruyucu Film
 * @Category 2860
 */
export type ScreenProtectorFieldsOptions = z.infer<
  typeof ScreenProtectorFieldsScheme
>;
