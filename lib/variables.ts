import { Companies, ProdcutCategories } from "./types";

export const companies = ["trendyol", "hepsiburada"] as const;
export const KDV = [0, 1, 10, 20] as const;
export const EMPTY_OPTION = "Bu alanı boş bırakmak istiyorum";

export const prodcutCategories = {
  trendyol: {
    phoneCase: "Kılıf",
    headphoneCase: "Kulaklık kılıfı",
    watchBand: "Saat kordonu",
    watchCharm: "Kordon süsü",
  },
  hepsiburada: {
    phoneCase: "kılıf",
  },
  // "kordon",
  // "charm",
  // "kablo koruyucu seti",
} as const;

type SheetNames<CompanyT extends Companies[number] = Companies[number]> = {
  [Company in CompanyT]: {
    [Category in keyof ProdcutCategories[Company]]: string;
  };
};
export const sheetNames: SheetNames = {
  trendyol: {
    phoneCase: "Ürünlerinizi Burada Listeleyin",
    headphoneCase: "Ürünlerinizi Burada Listeleyin",
    watchBand: "Ürünlerinizi Burada Listeleyin",
    watchCharm: "Ürünlerinizi Burada Listeleyin",
  },
  hepsiburada: {
    phoneCase: "Kılıflar",
  },
} as const;
