import { DistinctQuestion } from "inquirer";
import { homedir } from "os";
import {
  Collections,
  Companies,
  Config,
  ConfigOptions,
  Defaults,
  ProductCategories,
  Product,
  Project,
} from "./types";
export const companies = ["trendyol", "hepsiburada"] as const;
export const KDV = [0, 1, 10, 20] as const;
export const EMPTY_OPTION = "Bu alanı boş bırakmak istiyorum";

export const productCategories = {
  trendyol: {
    phoneCase: "Kılıf",
    headphoneCase: "Kulaklık kılıfı",
    watchBand: "Saat kordonu",
    watchCharm: "Kordon süsü",
    cableProtector: "Kablo koryucu seti",
    screenProtector: "Ekran koruyucu",
    lensProtector: "Lens koruyucu",
    caseStand: "Aparat",
    // Saat Kasası
    earphone: "Kulaklık",
    inCarPhoneHolder: "Araç içi telefon tutucu",
  },
  hepsiburada: {
    phoneCase: "Kılıf",
    headphoneCase: "Kulaklık kılıfı",
    watchBand: "Saat kordonu",
    // watchCharm: "Kordon süsü",
    cableProtector: "Kablo koryucu seti",
    // screenProtector: "Ekran koruyucu",
    lensProtector: "Lens koruyucu",
    caseStand: "Aparat",
    // Saat Kasası
    earphone: "Kulaklık",
    inCarPhoneHolder: "Araç içi telefon tutucu",
  },
};

type SheetNames<CompanyT extends Companies[number] = Companies[number]> = {
  [Company in CompanyT]: {
    [Category in keyof ProductCategories[Company]]: string;
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
    caseStand: "Ürünlerinizi Burada Listeleyin",
    inCarPhoneHolder: "Ürünlerinizi Burada Listeleyin",
    earphone: "Ürünlerinizi Burada Listeleyin",
  },
  hepsiburada: {
    phoneCase: "Kılıflar",
    headphoneCase: "Bluetooth Kulaklık Aksesuarları",
    watchBand: "5cdae8208f5811000fde4296",
    // watchCharm: "Ürünlerinizi Burada Listeleyin",
    cableProtector: "Diğer Telefon Aksesuarları",
    // screenProtector: "Ürünlerinizi Burada Listeleyin",
    lensProtector: "Diğer Telefon Aksesuarları",
    caseStand: "Diğer Telefon Aksesuarları",
    inCarPhoneHolder: "Araç İçi Telefon Tutacakları",
    earphone: "Kulak İçi Kulaklık",
  },
} as const;

export const configQuestionsObject: Record<
  keyof ConfigOptions,
  DistinctQuestion
> = {
  path: {
    name: "path",
    type: "directory",
    basePath: homedir(),
    message: "Klasör yolu seçiniz",
    suffix: ":",
  },
  runDatabase: {
    name: "runDatabase",
    type: "confirm",
    message: "Ürün kaydedilsin mi",
    suffix: "?",
  },
};

export const configDefaultValues: Config = {
  path: {
    name: "path",
    defaultValue: "Downloads",
    alwaysAsk: false,
  },
  runDatabase: {
    name: "runDatabase",
    defaultValue: false,
    alwaysAsk: false,
  },
} as const;

export const collectionsDefaultValues: Collections = [];
export const defaultsDefaultValues: Defaults = {
  hepsiburada: {
    trademark: {
      alwaysAsk: true,
      value: "",
    },
  },
  trendyol: {
    trademark: {
      alwaysAsk: true,
      value: "",
    },
  },
} as const;

export const projectDefaultValues: Project = {
  database: "JSON",
} as const;

export const productsDefaultValues: Product[] = [];
export const notionDefaultValues: Product[] = [];

export const dataFiles = [
  "collections",
  "config",
  "defaults",
  "project",
  "products",
  "notion",
] as const;

// Define a helper type to get default values based on the key
type DefaultValues<
  Key extends keyof Record<(typeof dataFiles)[number], unknown>
> = Key extends "collections"
  ? Collections
  : Key extends "config"
  ? Config
  : Key extends "defaults"
  ? Defaults
  : Key extends "project"
  ? Project
  : Key extends "products"
  ? Product[]
  : Key extends "notion"
  ? Product[]
  : never;

// Create the object with inferred keys and default values
export const dataFilesInitialValue: {
  [Key in (typeof dataFiles)[number]]: DefaultValues<Key>;
} = {
  collections: collectionsDefaultValues,
  config: configDefaultValues,
  defaults: defaultsDefaultValues,
  project: projectDefaultValues,
  products: productsDefaultValues,
  notion: notionDefaultValues,
};

export const databases = ["Notion", "JSON"] as const;
