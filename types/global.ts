import { companies, prodcutCategories } from "../variables/global";
import { z } from "zod";

export type Companies = typeof companies;
export type ProdcutCategories = typeof prodcutCategories;

export const ProductMainOptionsScheme = z.object({
  productTitle: z.string(),
  productCode: z.string(),
  price: z.number(),
  stockAmount: z.number(),
  productDescription: z.string(),
});

export type ProductMainOptions = z.infer<typeof ProductMainOptionsScheme>;

export type ArrayOfLiterals<T extends readonly (string | number)[]> =
  T[number][];
