import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
import {
  capitalizeLetters,
  cleanUp,
  generateGTIN,
  generateModelCodeHash,
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
  WatchBandFieldsOptions,
  WatchBandFieldsScheme,
  WatchBandOptions,
  WatchBandOptionsScheme,
} from "./types";
import {
  WatchBand_Brands,
  WatchBand_CustomSizes,
  WatchBand_GuaranteePeriods,
  WatchBand_Materials,
  WatchBand_Models,
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
      // validate: (input, answers) => {
      //   if (answers?.watchBandSizesList) {
      //     if (answers.watchBandSizesList.length <= 0 && input.length <= 0)
      //       return "Toplam en az 1 MM yazılmalı";
      //   } else {
      //     if (input.length <= 0)
      //       return "Toplam en az 1 MM yazılmalı";
      //   }
      //   return true;
      // },
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "input",
      name: "customWatchBandList",
      message: `Saat modeli yazınız (aralarında virgül koyarak)`,
      filter: (input: string) => {
        if (!lengthValidator(input)) return [];
        return cleanUp(input, false)
          .split(",")
          .map((phone) => {
            return capitalizeLetters(phone, false);
          });
      },
      validate: (input) => lengthValidator(input, true),
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
      name: "guaranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: WatchBand_GuaranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "watchBandBrand",
      message: "Uyumlu marka seçiniz",
      choices: WatchBand_Brands,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "model",
      message: "Uyumlu model seçiniz",
      choices: WatchBand_Models,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "confirm",
      name: "includeOptionInTitle",
      message: "Renk ürünün başlığında yer alsın mı?",
      default: false,
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

    // # Watchband loop

    for (let w = 0; w < [...result.customWatchBandList].length; w++) {
      const watchBand = result.customWatchBandList[w]!;

      // # Sizes Loop
      // TODO: Fix this stupid workaround
      const mmExist = !(
        !result.watchBandSizesList.length &&
        !result.customWatchBandSizesList.length
      );
      const sizes = mmExist
        ? [...result.watchBandSizesList, ...result.customWatchBandSizesList]
            .length
        : 1;

      for (let p = 0; p < sizes; p++) {
        const watchBandSize = [
          ...result.watchBandSizesList,
          ...result.customWatchBandSizesList,
        ][p]!;

        // 42, 41, 38-40-41
        const mm = mmExist
          ? removeWhiteSpaces(watchBandSize).replace(/m/gi, "")
          : "";

        const watchBandMm = [
          ...result.watchBandSizesList,
          ...result.customWatchBandSizesList,
        ][p] as (typeof WatchBand_Sizes)[number];
        // Galaxy A12 or A12 based on the input
        const phoneWithoutTheBrand = capitalizeLetters(
          cleanUp(
            // replaceTurkishI(watchBand).toLowerCase().replace(regex, ""),
            replaceTurkishI(watchBand).replace(regex, ""),
            false
          ),
          false
        );

        // 11Pro, GalaxyA12, A12
        const phoneCode = removeWhiteSpaces(phoneWithoutTheBrand);

        // Example: iPhone 11 Pro Uyumlu I Love Your Mom
        const productTitle = `${
          result.productKnownBrandName
        } ${phoneWithoutTheBrand} ${mmExist ? `(${mm} mm) ` : ""}Uyumlu ${
          result.includeOptionInTitle ? `${color} ` : ""
        }${productMainOptions.productTitle}`;

        // Example: SB-Watch1-42mm, SB-1-42mm, SB-1-2-3-4-42mm, SB-HASH-22m
        const productModalCode = `${productMainOptions.productCode}-${
          phoneCode.length > 20 ? generateModelCodeHash(phoneCode) : phoneCode
        }${mmExist ? `-${mm.slice(0, 2)}mm` : ""}`;

        const barcode = generateGTIN(companyMainOptions.trademark);

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
          Renk: color,

          Beden: WatchBand_Sizes.includes(watchBandMm)
            ? watchBandMm
            : WatchBand_Sizes.includes(
                `${mm.slice(0, 2)} mm` as (typeof WatchBand_Sizes)[number]
              )
            ? (`${mm.slice(0, 2)} mm` as (typeof WatchBand_Sizes)[number])
            : "",
          "Garanti Süresi": result.guaranteePeriod,
          Materyal:
            replaceEmptyOptionWithString(result.watchBandMaterial) ?? "",

          "Uyumlu Marka": result.watchBandBrand,
          "Uyumlu Model": replaceEmptyOptionWithString(result.model),
        };

        const fieldParseResult = FIELDS_SCHEME.safeParse(fields);

        if (!fieldParseResult.success) {
          console.error(
            `Zod error occur but the file will be created\nTitle length: ${productTitle.length}`,
            fieldParseResult.error
          );
        }

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
