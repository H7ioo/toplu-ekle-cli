import { z } from "zod";
import { TrendyolMainOptionsFieldsScheme } from "../types";
import {
  WatchCharm_Brands,
  WatchCharm_GuaranteePeriods,
  WatchCharm_Materials,
  WatchCharm_Sizes,
} from "./variables";
export const WatchCharmOptionsScheme = z.object({
  colors: z.array(z.string()),
  charmModel: z.array(z.string()),
  customWatchCharmList: z.array(z.string()),
  guaranteePeriod: z.enum(WatchCharm_GuaranteePeriods),
  watchCharmMaterial: z.enum(WatchCharm_Materials).optional(),
  watchCharmBrand: z.enum(WatchCharm_Brands),
  productKnownBrandName: z.string(),
});
/**
 * @CategoryName Elektronik > Elektronik Aksesuarlar > Giyilebilir Teknoloji Aksesuarları > Akıllı Saat Aksesuarları > Akıllı Saat Kordon
 * @Category 3222
 */
export type WatchCharmOptions = z.infer<typeof WatchCharmOptionsScheme>;

export const WatchCharmFieldsScheme = z

  .object({
    Kategori: z.literal(3222),
    Renk: z.string(),
    Beden: z.enum([...WatchCharm_Sizes, ""]),
    "Garanti Süresi": z.enum(WatchCharm_GuaranteePeriods),
    Materyal: z.enum([...WatchCharm_Materials, ""]),
    "Uyumlu Marka": z.enum(WatchCharm_Brands),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Elektronik > Elektronik Aksesuarlar > Giyilebilir Teknoloji Aksesuarları > Akıllı Saat Aksesuarları > Akıllı Saat Kordon
 * @Category 3222
 */
export type WatchCharmFieldsOptions = z.infer<typeof WatchCharmFieldsScheme>;
