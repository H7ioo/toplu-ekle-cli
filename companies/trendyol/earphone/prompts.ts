import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
import {
  capitalizeLetters,
  cleanUp,
  generateGTIN,
  lengthValidator,
  removeWhiteSpaces,
  replaceEmptyOptionWithString,
  replaceTurkishI,
} from "../../../lib/utils";
import { sheetNames } from "../../../lib/variables";
import { TrendyolMainFields } from "../prompts";
import { TrendyolMainOptions } from "../types";
import { TRENDYOL_SUFFIX } from "../variables";
import {
  EarphoneFieldsOptions,
  EarphoneFieldsScheme,
  EarphoneOptions,
  EarphoneOptionsScheme,
} from "./types";
import {
  Earphone_Connections,
  Earphone_Microphone,
  Earphone_NoiseCancel,
  Earphone_AudioProp,
  Earphone_GuaranteePeriods,
  Earphone_GuaranteeTypes,
  Earphone_TouchControl,
  Earphone_Types,
  Earphone_Waterproof,
} from "./variables";

const CATEGORY_ID = 1778 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "earphone" as const;
type OPTIONS_TYPE = EarphoneOptions;
const OPTIONS_SCHEME = EarphoneOptionsScheme;
type FIELDS_TYPE = EarphoneFieldsOptions;
const FIELDS_SCHEME = EarphoneFieldsScheme;

export async function earphone(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {
  const promptQuestions: QuestionCollection<OPTIONS_TYPE> = [
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
      name: "optionList",
      message: `Telefon modeli, marka vs. yazınızı (aralarında virgül koyarak)`,
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
      name: "connection",
      message: "Bağlantı seçiniz",
      choices: Earphone_Connections,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "usageType",
      message: "Hoparlör / Kulaklık /Çıkış Fişi seçiniz",
      choices: Earphone_Types,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "audioProp",
      message: "Ses özelliği seçeniz",
      choices: Earphone_AudioProp,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "guaranteeType",
      message: "Garanti tipi seçeniz",
      choices: Earphone_GuaranteeTypes,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "guaranteePeriod",
      message: "Garanti süresi seçeniz",
      choices: Earphone_GuaranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "noiseCancel",
      message: "Gürültü önleme seçeniz",
      choices: Earphone_NoiseCancel,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "waterproof",
      message: "Tere dayanıklı seçeniz",
      choices: Earphone_Waterproof,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "microphone",
      message: "Mikrofon seçiniz",
      choices: Earphone_Microphone,
      suffix: TRENDYOL_SUFFIX,
    },

    {
      type: "search-list",
      name: "touchControl",
      message: "Dokanmatin kontrol seçeniz",
      choices: Earphone_TouchControl,
      suffix: TRENDYOL_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  const products: FIELDS_TYPE[] = [];

  // # Colors Loop
  for (let c = 0; c < result.colors.length; c++) {
    const color = result.colors[c] as string;

    // # Options Loop
    for (let p = 0; p < [...result.optionList].length; p++) {
      const option = [...result.optionList][p] as string;
      // Galaxy A12 or A12 based on the input
      const phoneWithoutTheBrand = capitalizeLetters(
        cleanUp(replaceTurkishI(option).toLowerCase(), false)
      );

      // 11Pro, GalaxyA12, A12
      const phoneCode = removeWhiteSpaces(phoneWithoutTheBrand);

      // Example: iPhone 11 Pro Uyumlu I Love Your Mom
      const productTitle = `${phoneWithoutTheBrand} Uyumlu ${productMainOptions.productTitle}`;

      // Example: SB-11Pro
      const productModalCode = `${productMainOptions.productCode}-${phoneCode}`;

      const productCodeForTrendyol = `${productModalCode}-${removeWhiteSpaces(
        color
      )}`.toUpperCase();

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
        Bağlantı: result.connection,
        "Hoparlör / Kulaklık /Çıkış Fişi": replaceEmptyOptionWithString(
          result.usageType
        ),
        "Ses Özelliği": replaceEmptyOptionWithString(result.audioProp),
        "Garanti Tipi": replaceEmptyOptionWithString(result.guaranteeType),
        "Garanti Süresi": result.guaranteePeriod,
        "Aktif Gürültü Önleme (ANC)": result.noiseCancel,
        "Suya/Tere Dayanıklılık": replaceEmptyOptionWithString(
          result.waterproof
        ),
        Mikrofon: result.microphone,
        "Dokunmatik Kontrol": replaceEmptyOptionWithString(result.touchControl),
      };

      FIELDS_SCHEME.parse(fields);

      products.push(fields);
    }
  }

  return {
    products,
    category: CATEGORY_NAME,
    productKnownBrandName: undefined,
  };
}
