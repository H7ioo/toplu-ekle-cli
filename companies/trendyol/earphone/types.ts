import { z } from "zod";
import { TrendyolMainOptionsFieldsScheme } from "../types";
import {
  Earphone_AudioProp,
  Earphone_Connections,
  Earphone_GuaranteePeriods,
  Earphone_GuaranteeTypes,
  Earphone_Microphone,
  Earphone_NoiseCancel,
  Earphone_TouchControl,
  Earphone_Types,
  Earphone_Waterproof,
} from "./variables";
export const EarphoneOptionsScheme = z.object({
  colors: z.array(z.string()),
  optionList: z.array(z.string()),
  usageType: z.enum(Earphone_Types),
  touchControl: z.enum(Earphone_TouchControl),
  audioProp: z.enum(Earphone_AudioProp),
  waterproof: z.enum(Earphone_Waterproof),
  guaranteeType: z.enum(Earphone_GuaranteeTypes),
  guaranteePeriod: z.enum(Earphone_GuaranteePeriods),
  connection: z.enum(Earphone_Connections),
  microphone: z.enum(Earphone_Microphone),
  noiseCancel: z.enum(Earphone_NoiseCancel),
});
/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 */
export type EarphoneOptions = z.infer<typeof EarphoneOptionsScheme>;

export const EarphoneFieldsScheme = z
  .object({
    Kategori: z.literal(1778),
    Renk: z.string(),
    Bağlantı: z.enum(Earphone_Connections),
    "Hoparlör / Kulaklık /Çıkış Fişi": z.enum([...Earphone_Types, ""]),
    "Ses Özelliği": z.enum([...Earphone_AudioProp, ""]),
    "Garanti Tipi": z.enum([...Earphone_GuaranteeTypes, ""]),
    "Garanti Süresi": z.enum(Earphone_GuaranteePeriods),
    "Aktif Gürültü Önleme (ANC)": z.enum(Earphone_NoiseCancel),
    "Suya/Tere Dayanıklılık": z.enum([...Earphone_Waterproof, ""]),
    Mikrofon: z.enum(Earphone_Microphone),
    "Dokunmatik Kontrol": z.enum([...Earphone_TouchControl, ""]),
  })
  .merge(TrendyolMainOptionsFieldsScheme);

export type EarphoneFieldsOptions = z.infer<typeof EarphoneFieldsScheme>;
