import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
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
import { sheetNames } from "../../../lib/variables";
import { TrendyolMainFields } from "../prompts";
import { TrendyolMainOptions } from "../types";
import { TRENDYOL_SUFFIX } from "../variables";
import {
  WatchCharmFieldsOptions,
  WatchCharmFieldsScheme,
  WatchCharmOptions,
  WatchCharmOptionsScheme,
} from "./types";
import {
  WatchCharm_Brands,
  WatchCharm_GuaranteePeriods,
  WatchCharm_Materials,
} from "./variables";

const CATEGORY_ID = 3222 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "watchCharm" as const;
type OPTIONS_TYPE = WatchCharmOptions;
const OPTIONS_SCHEME = WatchCharmOptionsScheme;
type FIELDS_TYPE = WatchCharmFieldsOptions;
const FIELDS_SCHEME = WatchCharmFieldsScheme;

export async function watchCharm(
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
      type: "input",
      name: "charmModel",
      message:
        "Charm modelleri yazınız [harf, süs adı, vb.] [ör. B, C, Kalp, vb.] [Ürün başlığı buna benzer olmalı: ${charmModeli} Harflı Kordon Süsü, ${charmModeli} Süsü Kordon Süs] (aralarında virgül koyarak)",
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
      type: "input",
      name: "customWatchCharmList",
      message: `Saat modeli yazınız (aralarında virgül koyarak)`,
      filter: (input: string) => {
        if (!lengthValidator(input)) return [];
        return cleanUp(input)
          .split(",")
          .map((phone) => {
            return capitalizeLetters(phone);
          });
      },
      validate: (input) => lengthValidator(input, true),
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "watchCharmMaterial",
      message: "Materyal seçiniz",
      choices: WatchCharm_Materials,
      suffix: TRENDYOL_SUFFIX,
    },

    {
      type: "search-list",
      name: "guaranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: WatchCharm_GuaranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "watchCharmBrand",
      message: "Uyumlu marka seçiniz",
      choices: WatchCharm_Brands,
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

    // # WatchCharm loop

    for (let w = 0; w < [...result.customWatchCharmList].length; w++) {
      const watchCharm = result.customWatchCharmList[w]!;

      // # Charm Model Loop
      for (let p = 0; p < [...result.charmModel].length; p++) {
        const watchCharmModal = [...result.charmModel][p]!;

        // A, Kalp, B,
        const watchCharmModalWithoutSpaces = removeWhiteSpaces(watchCharmModal);

        // Galaxy A12 or A12 based on the input
        const phoneWithoutTheBrand = capitalizeLetters(
          cleanUp(
            replaceTurkishI(watchCharm).toLowerCase().replace(regex, ""),
            false
          )
        );

        // 11Pro, GalaxyA12, A12
        const phoneCode = removeWhiteSpaces(phoneWithoutTheBrand);

        // Example: iPhone 11 Pro Uyumlu I Love Your Mom
        const productTitle = `${result.productKnownBrandName} ${phoneWithoutTheBrand} Uyumlu ${watchCharmModalWithoutSpaces} ${productMainOptions.productTitle}`;

        // Example: SB-Watch1-Kalp, SB-1-B, SB-1-2-3-4-A
        const productModalCode = `${productMainOptions.productCode}-${phoneCode}-${watchCharmModalWithoutSpaces}`;

        const barcode = generateGTIN();

        const fields: FIELDS_TYPE = {
          ...TrendyolMainFields({
            barcode,
            productModalCode,
            trademark: companyMainOptions.trademark,
            CATEGORY_ID,
            productTitle,
            productDescription: productMainOptions.productDescription,
            marketPrice: companyMainOptions.marketPrice,
            price: productMainOptions.price,
            productCode: productMainOptions.productCode,
            shipmentTime: companyMainOptions.shipmentTime,
            shipmentType: companyMainOptions.shipmentType,
            stockAmount: productMainOptions.stockAmount,
          }),
          Renk: `${color}-${watchCharmModalWithoutSpaces}`,

          Beden: "",
          "Garanti Süresi": result.guaranteePeriod,
          Materyal:
            replaceEmptyOptionWithString(result.watchCharmMaterial) ?? "",

          "Uyumlu Marka": result.watchCharmBrand,
        };

        FIELDS_SCHEME.parse(fields);

        products.push(fields);
      }
    }
  }

  return {
    products,
    category: CATEGORY_NAME,
    productKnownBrandName: result.productKnownBrandName,
  };
}
