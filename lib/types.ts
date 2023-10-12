import { z } from "zod";
import { companies, prodcutCategories } from "./variables";

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

export const ConfigOptionsScheme = z.object({
  path: z.string(),
});

export type ConfigOptions = z.infer<typeof ConfigOptionsScheme>;

// export type ConfigFile<
//   TName extends keyof z.infer<typeof ConfigOptionsScheme> = keyof z.infer<
//     typeof ConfigOptionsScheme
//   >
// > = {
//   name: TName;
//   defaultValue: z.infer<typeof ConfigOptionsScheme>[TName];
//   alwaysAsk: boolean;
// };

export const ConfigFileScheme = z.object({
  name: ConfigOptionsScheme.keyof(),
  defaultValue: z.string(),
  alwaysAsk: z.boolean(),
});

export type ConfigFile = z.infer<typeof ConfigFileScheme>;

export type ConfigFileData = Record<keyof ConfigOptions, ConfigFile>;
