import { z } from "zod";
import { TrendyolMainOptionsFieldsScheme } from "../types";
import {
  LensProtector_CustomPhonesList,
  LensProtector_PhoneBrands,
} from "./variables";
export const LensProtectorOptionsScheme = z
  .object({
    colors: z.array(z.string()),
    phonesList: z.array(z.enum([...LensProtector_CustomPhonesList])),
    customPhonesList: z.array(z.string()),
    phoneBrand: z.enum(LensProtector_PhoneBrands),
    productKnownBrandName: z.string(),
  })
  .refine(({ phonesList, customPhonesList }) => {
    if (!phonesList && !customPhonesList) return false;
    return true;
  }, "One of the lists must exist");
/**
 * @CategoryName Kamera Lens Koruyucu Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Kamera Lens Koruyucu
 * @Category 5511
 */
export type LensProtectorOptions = z.infer<typeof LensProtectorOptionsScheme>;

export const LensProtectorFieldsScheme = z

  .object({
    Kategori: z.literal(5511),
    "Uyumlu Marka": z.enum([...LensProtector_PhoneBrands]),
    Renk: z.string(),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Kamera Lens Koruyucu Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Kamera Lens Koruyucu
 * @Category 5511
 */
export type LensProtectorFieldsOptions = z.infer<
  typeof LensProtectorFieldsScheme
>;
