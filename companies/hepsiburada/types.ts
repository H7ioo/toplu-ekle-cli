import { z } from "zod";
import { KDV } from "../../lib/variables";
export const HepsiburadaMainOptionsScheme = z.object({
  trademark: z.string(),
  guaranteePeriod: z.number(),
  productVideo: z.string().optional(),
});

export type HepsiburadaMainOptions = z.infer<
  typeof HepsiburadaMainOptionsScheme
>;

export const HepsiburadaMainOptionsFieldsScheme = z.object({
  "Ürün Adı": z.string().max(200, "En fazla 200 karakterden oluşmalıdır."),
  "Satıcı Stok Kodu": z
    .string()
    .max(100, "En fazla 100 karakterden oluşmalıdır."),
  Barkod: z.string(),
  // "Varyant Grup Id": z.string().max(40, "En fazla 40 karakterden oluşmalıdır."),
  "Varyant Grup Id": z.string(),
  "Ürün Açıklaması": z
    .string()
    .max(30_000, "En fazla 30.000 karakterden oluşmalıdır."),
  Marka: z.string(),
  Desi: z.number(),
  KDV: z.literal(KDV["3"]),
  "Garanti Süresi (Ay)": z.number(),
  Görsel1: z.unknown(),
  Görsel2: z.unknown(),
  Görsel3: z.unknown(),
  Görsel4: z.unknown(),
  Görsel5: z.unknown(),
  Fiyat: z.string(),
  Stok: z.number(),
  Video: z.number().or(z.string()),
});

export type HepsiburadaMainOptionsFields = z.infer<
  typeof HepsiburadaMainOptionsFieldsScheme
>;
