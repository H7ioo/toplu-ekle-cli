import { z } from "zod";
import { HepsiburadaMainOptionsFieldsScheme } from "../types";
import {
  Earphone_Colors,
  Earphone_Colors2,
  Earphone_Models,
  Earphone_UsageTypes,
  Earphone_UsageCases,
  Earphone_CableLength,
  Earphone_Connections,
  Earphone_Microphone,
  Earphone_NoiseCancel,
  Earphone_PackageContent,
} from "./variables";
export const EarphoneOptionsScheme = z.object({
  colors: z.array(z.enum(Earphone_Colors)),
  model: z.enum(Earphone_Models),
  optionList: z.array(z.string()),
  usageType: z.enum(Earphone_UsageTypes),
  usageCases: z.enum(Earphone_UsageCases),
  connection: z.enum(Earphone_Connections),
  microphone: z.enum(Earphone_Microphone),
  noiseCancel: z.enum(Earphone_NoiseCancel),
  cableLength: z.enum(Earphone_CableLength),
  packageContent: z.enum(Earphone_PackageContent),
});
/**
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Bluetooth Kulaklık Aksesuarları
 */
export type EarphoneOptions = z.infer<typeof EarphoneOptionsScheme>;

export const EarphoneFieldsScheme = z
  .object({
    Renk2: z.enum([...Earphone_Colors2, ""]),
    "Kulaklık Modeli": z.enum(Earphone_Models),
    Renk: z.enum([...Earphone_Colors]),
    Bağlantı: z.enum(Earphone_Connections),
    Mikrofon: z.enum(Earphone_Microphone),
    "Kullanım Tipi": z.enum(Earphone_UsageTypes),
    "Kullanım Alanı": z.enum(Earphone_UsageCases),
    "Gürültü Önleme": z.enum([...Earphone_NoiseCancel, ""]),
    "Kablo Uzunluğu": z.enum([...Earphone_CableLength, ""]),
    "Paket İçeriği": z.enum([...Earphone_PackageContent, ""]),
  })
  .merge(HepsiburadaMainOptionsFieldsScheme);

export type EarphoneFieldsOptions = z.infer<typeof EarphoneFieldsScheme>;
