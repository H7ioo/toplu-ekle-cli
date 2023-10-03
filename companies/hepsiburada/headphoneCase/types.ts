import { z } from "zod";
import { HepsiburadaMainOptionsFieldsScheme } from "../types";
import {
  HeadphoneCase_Colors,
  HeadphoneCase_CustomHeadphonesList,
  HeadphoneCase_HeadphoneAccessoryType,
} from "./variables";
export const HeadphoneCaseOptionsScheme = z
  .object({
    colors: z.array(z.enum(HeadphoneCase_Colors)),
    accessoryType: z.enum(HeadphoneCase_HeadphoneAccessoryType),
    headPhonesList: z.array(z.enum(HeadphoneCase_CustomHeadphonesList)),
    customHeadPhoneList: z.array(z.string()),
    productKnownBrandName: z.string(),
  })
  .refine(({ headPhonesList, customHeadPhoneList }) => {
    if (!headPhonesList && !customHeadPhoneList) return false;
    return true;
  }, "One of the lists must exist");
/**
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Bluetooth Kulaklık Aksesuarları
 */
export type HeadphoneCaseOptions = z.infer<typeof HeadphoneCaseOptionsScheme>;

export const HeadphoneFieldsScheme = z
  .object({
    Renk: z.enum([...HeadphoneCase_Colors, ""]),
    "Kulaklık Aksesuarı Türü": z.enum(HeadphoneCase_HeadphoneAccessoryType),
  })
  .merge(HepsiburadaMainOptionsFieldsScheme);

export type HeadphoneFieldsOptions = z.infer<typeof HeadphoneFieldsScheme>;
