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
    cableProtector: "Kablo koryucu seti",
    screenProtector: "Ekran koruyucu",
    lensProtector: "Lens koruyucu",
    // Lens
    // Saat Kasası
    // Aparat
  },
  hepsiburada: {
    phoneCase: "Kılıf",
  },
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
    cableProtector: "Ürünlerinizi Burada Listeleyin",
    screenProtector: "Ürünlerinizi Burada Listeleyin",
    lensProtector: "Ürünlerinizi Burada Listeleyin",
  },
  hepsiburada: {
    phoneCase: "Kılıflar",
  },
} as const;
