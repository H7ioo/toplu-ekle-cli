import { z } from "zod";
import { KDV } from "../variables/global";
import {
  trendyolCaseMaterials_PhoneCase,
  trendyolCaseTypes_PhoneCase,
  trendyolGuaranteePeriods_HeadphoneCase,
  trendyolGuaranteePeriods_PhoneCase,
  trendyolGuaranteeTypes_PhoneCase,
  trendyolHeadPhoneBrands_HeadphoneCase,
  trendyolHeadphonesList_HeadphoneCase,
  trendyolPhoneBrands_PhoneCase,
  trendyolPhonesList_PhoneCase,
  trendyolPhonesListExtend_PhoneCase,
  trendyolShipmentType,
} from "../variables/trendyol";

export const TrendyolMainOptionsScheme = z.object({
  trademark: z.string(),
  marketPrice: z.number(),
  shipmentTime: z.number().optional(),
  shipmentType: z.enum(trendyolShipmentType).optional(),
});

export type TrendyolMainOptions = z.infer<typeof TrendyolMainOptionsScheme>;

export const TrendyolMainOptionsFieldsScheme = z.object({
  Barkod: z.string(),
  "Model Kodu": z.string(),
  Marka: z.string(),
  "Para Birimi": z.literal("TRY"),
  "Ürün Adı": z.string(),
  "Ürün Açıklaması": z.string(),
  "Piyasa Satış Fiyatı (KDV Dahil)": z.number(),
  "Trendyol'da Satılacak Fiyat (KDV Dahil)": z.number(),
  "Ürün Stok Adedi": z.number(),
  "Stok Kodu": z.string(),
  "KDV Oranı": z.literal(KDV["3"]),
  Desi: z.string(),
  "Görsel 1": z.unknown(),
  "Görsel 2": z.unknown(),
  "Görsel 3": z.unknown(),
  "Görsel 4": z.unknown(),
  "Görsel 5": z.unknown(),
  "Görsel 6": z.unknown(),
  "Görsel 7": z.unknown(),
  "Görsel 8": z.unknown(),
  "Sevkiyat Süresi": z.number().or(z.string()),
  "Sevkiyat Tipi": z.enum(trendyolShipmentType).or(z.string()),
});

export const PhoneCaseOptionsScheme = z
  .object({
    colors: z.array(z.string()),
    caseMaterial: z.enum(trendyolCaseMaterials_PhoneCase).optional(),
    caseType: z.enum(trendyolCaseTypes_PhoneCase).optional(),
    phonesList: z.array(
      z.enum([
        ...trendyolPhonesList_PhoneCase,
        ...trendyolPhonesListExtend_PhoneCase,
      ])
    ),
    customPhonesList: z.array(z.string()),
    guranteeType: z.enum(trendyolGuaranteeTypes_PhoneCase).optional(),
    guranteePeriod: z.enum(trendyolGuaranteePeriods_PhoneCase).optional(),
    phoneBrand: z.enum(trendyolPhoneBrands_PhoneCase).optional(),
    productKnownBrandName: z.string(),
  })
  .refine(({ phonesList, customPhonesList }) => {
    if (!phonesList && !customPhonesList) return false;
    return true;
  }, "One of the lists must exist");
/**
 * @CategoryName Kapak & Kılıf Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Kapak & Kılıf
 * @Category 766
 */
export type PhoneCaseOptions = z.infer<typeof PhoneCaseOptionsScheme>;

export const PhoneCaseFieldsScheme = z

  .object({
    Kategori: z.literal(766),
    Renk: z.string(),
    Materyal: z.enum([...trendyolCaseMaterials_PhoneCase, ""]).or(z.string()),
    Model: z.enum([...trendyolCaseTypes_PhoneCase, ""]).or(z.string()),
    "Cep Telefonu Modeli": z
      .enum([
        ...trendyolPhonesList_PhoneCase,
        ...trendyolPhonesListExtend_PhoneCase,
        "",
      ])
      .or(z.string()),
    "Garanti Tipi": z.enum(trendyolGuaranteeTypes_PhoneCase).or(z.string()),
    "Garanti Süresi": z.enum(trendyolGuaranteePeriods_PhoneCase).or(z.string()),
    "Uyumlu Marka": z.enum(trendyolPhoneBrands_PhoneCase).or(z.string()),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Kapak & Kılıf Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Kapak & Kılıf
 * @Category 766
 */
export type PhoneCaseFields = z.infer<typeof PhoneCaseFieldsScheme>;

export const HeadphoneCaseOptionsScheme = z
  .object({
    colors: z.array(z.string()),
    guranteePeriod: z.enum(trendyolGuaranteePeriods_HeadphoneCase),
    headPhoneBrand: z.enum(trendyolHeadPhoneBrands_HeadphoneCase).optional(),
    headPhonesList: z.array(z.enum(trendyolHeadphonesList_HeadphoneCase)),
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
    "Garanti Süresi": z.enum(trendyolGuaranteePeriods_HeadphoneCase),
    "Uyumlu Marka": z
      .enum(trendyolHeadPhoneBrands_HeadphoneCase)
      .or(z.string()),
    "Uyumlu Model": z.enum(trendyolHeadphonesList_HeadphoneCase).or(z.string()),
  })
  .merge(TrendyolMainOptionsFieldsScheme);

export type HeadphoneFieldsOptions = z.infer<typeof HeadphoneFieldsScheme>;
