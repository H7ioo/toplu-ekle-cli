import { z } from "zod";
import { companies, databases, productCategories } from "./variables";

export type Companies = typeof companies;
export type ProductCategories = typeof productCategories;

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
  runDatabase: z.boolean(),
});

export type ConfigOptions = z.infer<typeof ConfigOptionsScheme>;

export const ConfigFileScheme = z.object({
  name: ConfigOptionsScheme.keyof(),
  defaultValue: z.any(),
  alwaysAsk: z.boolean(),
});

export type ConfigFile = z.infer<typeof ConfigFileScheme>;

export type Config = Record<keyof ConfigOptions, ConfigFile>;

export type Collections<
  CompanyT extends Companies[number] = Companies[number]
> = {
  id: string;
  company: CompanyT;
  category: keyof ProductCategories[CompanyT];
  collectionName: string;
  values: string[];
}[];

export type Defaults = {
  [Company in Companies[number]]: {
    trademark: {
      value: string;
      alwaysAsk: boolean;
    };
  };
};

export type Project = {
  database: (typeof databases)[number];
};

export type Product = ProductMainOptions & {
  id: string;
};
