import { QuestionCollection, prompt } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  generateGTIN,
  lengthValidator,
  removePhoneBrandRegEx,
  removeWhiteSpaces,
  replaceEmptyOptionWithString,
  replaceTurkishI,
} from "../../../lib/utils";
import { ProductMainOptions } from "../../../lib/types";
import { TRENDYOL_SUFFIX } from "../variables";
import { TrendyolMainOptions } from "../types";
import { KDV, sheetNames } from "../../../lib/variables";
import {
  WatchBandFieldsOptions,
  WatchBandFieldsScheme,
  WatchBandOptions,
  WatchBandOptionsScheme,
} from "./types";
import {
  WatchBand_Brands,
  WatchBand_CustomSizes,
  WatchBand_GuranteePeriods,
  WatchBand_Materials,
  WatchBand_Sizes,
} from "./variables";

const CATEGORY_ID = 3222 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "watchBand" as const;
type OPTIONS_TYPE = WatchBandOptions;
const OPTIONS_SCHEME = WatchBandOptionsScheme;
type FIELDS_TYPE = WatchBandFieldsOptions;
const FIELDS_SCHEME = WatchBandFieldsScheme;

export async function watchBand(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {
  const promptQuestions: QuestionCollection<OPTIONS_TYPE> = [
    {
      type: "input",
      name: "productKnownBrandName",
      message: "Markanın bilinen adı yazınız",
      filter: (input: string) => {
        return cleanUp(input, false);
      },
      validate: (input) => {
        return lengthValidator(input, true);
      },
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "input",
      name: "colors",
      message: "Renkleri yazınız (aralarında virgül koyarak)",
      filter: (input: string) => {
        return cleanUp(input)
          .split(",")
          .map((colorAnswer) => {
            return capitalizeLetters(colorAnswer);
          });
      },
      validate: (input) => lengthValidator(input, true),
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-checkbox",
      name: "watchBandSizesList",
      message: `Kordon MM seçiniz`,
      choices: [...WatchBand_Sizes, ...WatchBand_CustomSizes],
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "input",
      name: "customWatchBandSizesList",
      message: `Kordon MM yazınız (aralarında virgül koyarak)`,
      filter: (input: string) => {
        if (!lengthValidator(input)) return [];
        return cleanUp(input)
          .split(",")
          .map((phone) => {
            return capitalizeLetters(phone);
          });
      },
      validate: (input, answers) => {
        if (answers?.watchBandSizesList) {
          if (answers.watchBandSizesList.length <= 0 && input.length <= 0)
            return "Toplam en az 1 telefom modlei eklenmeli";
        } else {
          if (input.length <= 0)
            return "Toplam en az 1 telefom modlei eklenmeli";
        }
        return true;
      },
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "watchBandMaterial",
      message: "Materyal seçiniz",
      choices: WatchBand_Materials,
      suffix: TRENDYOL_SUFFIX,
    },

    {
      type: "search-list",
      name: "guranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: WatchBand_GuranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "watchBandBrand",
      message: "Uyumlu marka seçiniz",
      choices: WatchBand_Brands,
      suffix: TRENDYOL_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  // Regex made to remove Samsung from "Samsung Galaxy A12"
  const regex = removePhoneBrandRegEx(result.productKnownBrandName);

  const products: FIELDS_TYPE[] = [];

  // # Colors Loop
  for (let c = 0; c < result.colors.length; c++) {
    const color = result.colors[c] as string;

    // # Phones Loop
    for (
      let p = 0;
      p <
      [...result.watchBandSizesList, ...result.customWatchBandSizesList].length;
      p++
    ) {
      // TODO: String | Undefined
      const phone = [
        ...result.watchBandSizesList,
        ...result.customWatchBandSizesList,
      ][p] as (typeof WatchBand_Sizes)[number];
      // Galaxy A12 or A12 based on the input
      const phoneWithoutTheBrand = capitalizeLetters(
        cleanUp(replaceTurkishI(phone).toLowerCase().replace(regex, ""), false)
      );

      // 11Pro, GalaxyA12, A12
      const phoneCode = removeWhiteSpaces(phoneWithoutTheBrand);

      // Example: iPhone 11 Pro Uyumlu I Love Your Mom
      const productTitle = `${result.productKnownBrandName} ${phoneWithoutTheBrand} Uyumlu ${productMainOptions.productTitle}`;

      // Example: SB-11Pro
      const productModalCode = `${productMainOptions.productCode}-${phoneCode}`;

      const barcode = generateGTIN();

      const fields: FIELDS_TYPE = {
        Barkod: barcode,
        "Model Kodu": productModalCode,
        Marka: companyMainOptions.trademark ?? "",
        Kategori: CATEGORY_ID,
        "Para Birimi": "TRY",
        "Ürün Adı": productTitle,
        "Ürün Açıklaması": productMainOptions.productDescription,
        "Piyasa Satış Fiyatı (KDV Dahil)": companyMainOptions.marketPrice,
        "Trendyol'da Satılacak Fiyat (KDV Dahil)": productMainOptions.price,
        "Ürün Stok Adedi": productMainOptions.stockAmount,
        "Stok Kodu": productMainOptions.productCode,
        "KDV Oranı": KDV["3"],
        Desi: "",
        "Görsel 1": "",
        "Görsel 2": "",
        "Görsel 3": "",
        "Görsel 4": "",
        "Görsel 5": "",
        "Görsel 6": "",
        "Görsel 7": "",
        "Görsel 8": "",
        "Sevkiyat Süresi":
          replaceEmptyOptionWithString(companyMainOptions.shipmentTime) ?? "",
        "Sevkiyat Tipi":
          replaceEmptyOptionWithString(companyMainOptions.shipmentType) ?? "",
        Renk: color,
        Materyal: replaceEmptyOptionWithString(result.watchBandMaterial) ?? "",
        Beden: WatchBand_Sizes.includes(phone) ? phone : "",
        "Garanti Süresi": result.guranteePeriod,
        "Uyumlu Marka": result.watchBandBrand,
      };

      FIELDS_SCHEME.parse(fields);

      products.push(fields);
    }
  }

  return { products, category: CATEGORY_NAME };
}
