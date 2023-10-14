import { z } from "zod";
import { TrendyolMainOptionsFieldsScheme } from "../types";
import {
  HeadphoneCase_GuaranteePeriods,
  HeadphoneCase_HeadPhoneBrands,
  HeadphoneCase_HeadphonesList,
  HeadphoneCase_CustomHeadphonesList,
} from "./variables";
export const HeadphoneCaseOptionsScheme = z
  .object({
    colors: z.array(z.string()),
    guaranteePeriod: z.enum(HeadphoneCase_GuaranteePeriods),
    headPhoneBrand: z.enum(HeadphoneCase_HeadPhoneBrands).optional(),
    headPhonesList: z.array(
      z.enum([
        ...HeadphoneCase_HeadphonesList,
        ...HeadphoneCase_CustomHeadphonesList,
      ])
    ),
    customHeadPhoneList: z.array(z.string()),
    productKnownBrandName: z.string(),
  })
  .refine(({ headPhonesList, customHeadPhoneList }) => {
    if (!headPhonesList && !customHeadPhoneList) return false;
    return true;
  }, "One of the lists must exist");
/**
 * @CategoryName Kulaklık Kılıfı Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Kulaklık Kılıfı
 * @Category 3494
 */
export type HeadphoneCaseOptions = z.infer<typeof HeadphoneCaseOptionsScheme>;

export const HeadphoneFieldsScheme = z
  .object({
    Kategori: z.literal(3494),
    Renk: z.string(),
    "Garanti Süresi": z.enum(HeadphoneCase_GuaranteePeriods),
    "Uyumlu Marka": z.enum([...HeadphoneCase_HeadPhoneBrands, ""]),
    "Uyumlu Model": z.enum([...HeadphoneCase_HeadphonesList, ""]),
  })
  .merge(TrendyolMainOptionsFieldsScheme);

export type HeadphoneFieldsOptions = z.infer<typeof HeadphoneFieldsScheme>;
