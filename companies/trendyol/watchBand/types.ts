import { z } from "zod";
import { TrendyolMainOptionsFieldsScheme } from "../types";
import {
  WatchBand_Brands,
  WatchBand_CustomSizes,
  WatchBand_GuaranteePeriods,
  WatchBand_Materials,
  WatchBand_Models,
  WatchBand_Sizes,
} from "./variables";
export const WatchBandOptionsScheme = z
  .object({
    colors: z.array(z.string()),
    watchBandSizesList: z.array(
      z.enum([...WatchBand_Sizes, ...WatchBand_CustomSizes])
    ),
    customWatchBandSizesList: z.array(z.string()),
    customWatchBandList: z.array(z.string()),
    guaranteePeriod: z.enum(WatchBand_GuaranteePeriods),
    watchBandMaterial: z.enum(WatchBand_Materials).optional(),
    watchBandBrand: z.enum(WatchBand_Brands),
    model: z.enum(WatchBand_Models),
    productKnownBrandName: z.string(),
  })
  .refine(({ watchBandSizesList, customWatchBandSizesList }) => {
    if (!watchBandSizesList && !customWatchBandSizesList) return false;
    return true;
  }, "One of the lists must exist");
/**
 * @CategoryName Elektronik > Elektronik Aksesuarlar > Giyilebilir Teknoloji Aksesuarları > Akıllı Saat Aksesuarları > Akıllı Saat Kordon
 * @Category 3222
 */
export type WatchBandOptions = z.infer<typeof WatchBandOptionsScheme>;

export const WatchBandFieldsScheme = z

  .object({
    Kategori: z.literal(3222),
    Renk: z.string(),
    Beden: z.enum([...WatchBand_Sizes, ""]),
    "Garanti Süresi": z.enum(WatchBand_GuaranteePeriods),
    Materyal: z.enum([...WatchBand_Materials, ""]),
    "Uyumlu Marka": z.enum(WatchBand_Brands),
    "Uyumlu Model": z.enum([...WatchBand_Models, ""]),
  })
  .merge(TrendyolMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Elektronik > Elektronik Aksesuarlar > Giyilebilir Teknoloji Aksesuarları > Akıllı Saat Aksesuarları > Akıllı Saat Kordon
 * @Category 3222
 */
export type WatchBandFieldsOptions = z.infer<typeof WatchBandFieldsScheme>;
