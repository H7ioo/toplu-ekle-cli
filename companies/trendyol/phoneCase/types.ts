import { z } from "zod";
import {
  PhoneCase_CaseMaterials,
  PhoneCase_CaseTypes,
  PhoneCase_GuaranteePeriods,
  PhoneCase_GuaranteeTypes,
  PhoneCase_PhoneBrands,
  PhoneCase_PhonesListExtend,
  PhoneCase_PhonesList,
} from "./variables";
import { TrendyolMainOptionsFieldsScheme } from "../types";
export const PhoneCaseOptionsScheme = z
  .object({
    colors: z.array(z.string()),
    caseMaterial: z.enum(PhoneCase_CaseMaterials).optional(),
    caseType: z.enum(PhoneCase_CaseTypes).optional(),
    phonesCollection: z.array(z.string()).optional(),
    phonesList: z.array(
      z.enum([...PhoneCase_PhonesList, ...PhoneCase_PhonesListExtend])
    ),
    customPhonesList: z.array(z.string()),
    guaranteeType: z.enum(PhoneCase_GuaranteeTypes).optional(),
    guaranteePeriod: z.enum(PhoneCase_GuaranteePeriods).optional(),
    phoneBrand: z.enum(PhoneCase_PhoneBrands).optional(),
    productKnownBrandName: z.string(),
    includeOptionInTitle: z.boolean(),
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
    Materyal: z.enum([...PhoneCase_CaseMaterials, ""]),
    Model: z.enum([...PhoneCase_CaseTypes, ""]),
    "Cep Telefonu Modeli": z.enum([
      ...PhoneCase_PhonesList,
      ...PhoneCase_PhonesListExtend,
      "",
    ]),
    "Garanti Tipi": z.enum([...PhoneCase_GuaranteeTypes, ""]),
    "Garanti Süresi": z.enum([...PhoneCase_GuaranteePeriods, ""]),
    "Uyumlu Marka": z.enum([...PhoneCase_PhoneBrands, ""]),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Kapak & Kılıf Elektronik > Elektronik Aksesuarlar > Cep Telefonu Aksesuarları > Kapak & Kılıf
 * @Category 766
 */
export type PhoneCaseFieldsOptions = z.infer<typeof PhoneCaseFieldsScheme>;
