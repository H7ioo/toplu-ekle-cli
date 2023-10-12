import { z } from "zod";
import { ShipmentTypes } from "./variables";
import { KDV } from "../../lib/variables";
export const TrendyolMainOptionsScheme = z.object({
  trademark: z.string(),
  marketPrice: z.number(),
  shipmentTime: z.number().optional(),
  shipmentType: z.enum(ShipmentTypes),
});

export type TrendyolMainOptions = z.infer<typeof TrendyolMainOptionsScheme>;

export const TrendyolMainOptionsFieldsScheme = z.object({
  Barkod: z.string(),
  "Model Kodu": z.string().max(40, "En fazla 40 karakterden oluşmalıdır."),
  Marka: z.string(),
  "Para Birimi": z.literal("TRY"),
  "Ürün Adı": z.string().max(100, "En fazla 100 karakterden oluşmalıdır."),
  "Ürün Açıklaması": z
    .string()
    .max(30_000, "En fazla 30.000 karakterden oluşmalıdır."),
  "Piyasa Satış Fiyatı (KDV Dahil)": z.number(),
  "Trendyol'da Satılacak Fiyat (KDV Dahil)": z.number(),
  "Ürün Stok Adedi": z.number(),
  "Stok Kodu": z.string().max(100, "En fazla 100 karakterden oluşmalıdır."),
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
  "Sevkiyat Tipi": z.enum(ShipmentTypes).or(z.string()),
});

export type TrendyolMainOptionsFields = z.infer<
  typeof TrendyolMainOptionsFieldsScheme
>;
