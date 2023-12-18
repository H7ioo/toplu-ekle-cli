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
  replaceTurkishI,
} from "../../../lib/utils";
import { sheetNames } from "../../../lib/variables";
import { HepsiburadaMainFields } from "../prompts";
import { HepsiburadaMainOptions } from "../types";
import { HEPSIBURADA_SUFFIX } from "../variables";
import {
  WatchBandFieldsOptions,
  WatchBandFieldsScheme,
  WatchBandOptions,
  WatchBandOptionsScheme,
} from "./types";
import {
  WatchBand_Brands,
  WatchBand_Colors,
  WatchBand_CustomSizes,
} from "./variables";

const CATEGORY_NAME: keyof (typeof sheetNames)["hepsiburada"] =
  "watchBand" as const;
type OPTIONS_TYPE = WatchBandOptions;
const OPTIONS_SCHEME = WatchBandOptionsScheme;
type FIELDS_TYPE = WatchBandFieldsOptions;
const FIELDS_SCHEME = WatchBandFieldsScheme;

export async function watchBand(
  productMainOptions: ProductMainOptions,
  companyMainOptions: HepsiburadaMainOptions
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
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-checkbox",
      name: "colors",
      message: "Renkleri seçiniz",
      choices: WatchBand_Colors,
      validate: (input) => lengthValidator(input, true),
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-checkbox",
      name: "watchBandSizesList",
      message: `Kordon MM seçiniz`,
      choices: [...WatchBand_CustomSizes],
      suffix: HEPSIBURADA_SUFFIX,
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
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "input",
      name: "customWatchBandList",
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
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "watchBandBrand",
      message: "Uyumlu marka seçiniz",
      choices: WatchBand_Brands,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "input",
      name: "options",
      message: "Seçenekler yazınız (aralarında virgül koyarak)",
      filter: (input: string) => {
        return cleanUp(input)
          .split(",")
          .map((colorAnswer) => {
            return capitalizeLetters(colorAnswer);
          });
      },
      suffix: HEPSIBURADA_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  // Regex made to remove Samsung from "Samsung Galaxy A12"
  const regex = removePhoneBrandRegEx(result.productKnownBrandName);

  const products: FIELDS_TYPE[] = [];

  // # Options Loop
  for (let o = 0; o < result.options.length; o++) {
    const option = result.options[o] as string;
    // # Colors Loop
    for (let c = 0; c < result.colors.length; c++) {
      const color = result.colors[c] as (typeof WatchBand_Colors)[number];

      // # Watchband loop

      for (let w = 0; w < [...result.customWatchBandList].length; w++) {
        const watchBand = result.customWatchBandList[w]!;

        // # Sizes Loop
        for (
          let p = 0;
          p <
          [...result.watchBandSizesList, ...result.customWatchBandSizesList]
            .length;
          p++
        ) {
          const watchBandSize = [
            ...result.watchBandSizesList,
            ...result.customWatchBandSizesList,
          ][p]!;

          // 42, 41, 38-40-41
          const mm = removeWhiteSpaces(watchBandSize).replace(/m/gi, "");

          const watchBandMm = [
            ...result.watchBandSizesList,
            ...result.customWatchBandSizesList,
          ][p] as (typeof WatchBand_CustomSizes)[number];
          // Galaxy A12 or A12 based on the input
          const phoneWithoutTheBrand = capitalizeLetters(
            cleanUp(
              replaceTurkishI(watchBand).toLowerCase().replace(regex, ""),
              false
            )
          );

          // 11Pro, GalaxyA12, A12
          const phoneCode = removeWhiteSpaces(phoneWithoutTheBrand);

          // Example: iPhone 11 Pro Uyumlu I Love Your Mom
          const productTitle = `${result.productKnownBrandName} ${phoneWithoutTheBrand} (${mm} mm) Uyumlu ${productMainOptions.productTitle}`;

          // Example: SB-Watch1-42mm, SB-1-42mm, SB-1-2-3-4-42mm
          const productModalCode = `${productMainOptions.productCode}-${
            phoneCode.length > 20 ? generateModelCodeHash(phoneCode) : phoneCode
          }-${mm.slice(0, 2)}mm`; // HAVE TO BECAUSE ON 20 and 22 it's too long

          const productCodeForHepsiburada =
            `${productModalCode}-${removeWhiteSpaces(color)}`.toUpperCase();

          const barcode = generateGTIN(companyMainOptions.trademark);

          const fields: FIELDS_TYPE = {
            ...HepsiburadaMainFields({
              barcode,
              productModalCode,
              trademark: companyMainOptions.trademark,
              productTitle,
              productDescription: productMainOptions.productDescription,
              price: productMainOptions.price,
              productCode: productCodeForHepsiburada,
              stockAmount: productMainOptions.stockAmount,
              guaranteePeriod: companyMainOptions.guaranteePeriod,
              productVideo: companyMainOptions.productVideo,
            }),
            Renk: color,
            Seçenek: option,
            "Uyumlu Marka": result.watchBandBrand,
          };

          FIELDS_SCHEME.parse(fields);

          products.push(fields);
        }
      }
    }
  }

  return {
    products,
    category: CATEGORY_NAME,
    productKnownBrandName: result.productKnownBrandName,
  };
}
