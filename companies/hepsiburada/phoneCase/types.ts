import { z } from "zod";
import {
  PhoneCase_CaseMaterials,
  PhoneCase_CaseTypes,
  PhoneCase_GuaranteeTypes,
  PhoneCase_PhoneBrands,
  PhoneCase_PhonesListExtend,
  PhoneCase_PhonesList,
  PhoneCase_PhoneModelsList,
  PhoneCase_Colors,
  PhoneCase_WaterProof,
  PhoneCase_PhonesListCode,
} from "./variables";
import { HepsiburadaMainOptionsFieldsScheme } from "../types";
export const PhoneCaseOptionsScheme = z
  .object({
    colors: z.array(z.enum([...PhoneCase_Colors])),
    caseMaterial: z.enum(PhoneCase_CaseMaterials).optional(),
    caseType: z.enum(PhoneCase_CaseTypes).optional(),
    phonesList: z.array(
      z.enum([...PhoneCase_PhonesList, ...PhoneCase_PhonesListExtend])
    ),
    customPhonesList: z.array(z.string()),
    guaranteeType: z.enum(PhoneCase_GuaranteeTypes).optional(),
    phoneBrand: z.enum(PhoneCase_PhoneBrands),
    phoneWaterProof: z.enum(PhoneCase_WaterProof).optional(),
    options: z.array(z.string()),
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
    "Uyumlu Model": z.enum([...PhoneCase_PhoneModelsList, ""]),
    Renk: z.enum([...PhoneCase_Colors, ""]),
    Seçenek: z.string(),
    "Telefon Modeli": z.enum([
      ...PhoneCase_PhonesList,
      ...PhoneCase_PhonesListExtend,
    ]),
    "Uyumlu Marka": z.enum([...PhoneCase_PhoneBrands]),
    "Garanti Tipi": z.enum([...PhoneCase_GuaranteeTypes, ""]),
    "Su Geçirmezlik": z.enum([...PhoneCase_WaterProof, ""]),
    "Ürün  Kodu": z.enum([...PhoneCase_PhonesListCode, ""]),
    "Malzeme Türü": z.enum([...PhoneCase_CaseMaterials, ""]),
    "Garanti Tipi2": z.enum([...PhoneCase_GuaranteeTypes, ""]),
    "Kılıf Tipi": z.enum([...PhoneCase_CaseTypes, ""]),
  })
  .merge(HepsiburadaMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Kapak & Kılıf Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Kapak & Kılıf
 * @Category 766
 */
export type PhoneCaseFieldsOptions = z.infer<typeof PhoneCaseFieldsScheme>;
