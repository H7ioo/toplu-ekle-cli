import { z } from "zod";
import { HepsiburadaMainOptionsFieldsScheme } from "../types";
import {
  WatchBand_Brands,
  WatchBand_Colors,
  WatchBand_CustomSizes,
} from "./variables";
export const WatchBandOptionsScheme = z
  .object({
    colors: z.array(z.enum(WatchBand_Colors)),
    watchBandSizesList: z.array(z.enum([...WatchBand_CustomSizes])),
    customWatchBandSizesList: z.array(z.string()),
    customWatchBandList: z.array(z.string()),
    watchBandBrand: z.enum(WatchBand_Brands),
    options: z.array(z.string()),
    productKnownBrandName: z.string(),
  })
  .refine(({ watchBandSizesList, customWatchBandSizesList }) => {
    if (!watchBandSizesList && !customWatchBandSizesList) return false;
    return true;
  }, "One of the lists must exist");
/**
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Akıllı Saat ve Bileklik Aksesuarları
 */
export type WatchBandOptions = z.infer<typeof WatchBandOptionsScheme>;

export const WatchBandFieldsScheme = z

  .object({
    Renk: z.enum(WatchBand_Colors),
    Seçenek: z.string(),
    "Uyumlu Marka": z.enum(WatchBand_Brands),
  })
  .merge(HepsiburadaMainOptionsFieldsScheme);
/**
 * @ExcelFields
 * @CategoryName Telefon > Cep Telefonu Aksesuarları > Akıllı Saat ve Bileklik Aksesuarları
 */
export type WatchBandFieldsOptions = z.infer<typeof WatchBandFieldsScheme>;
