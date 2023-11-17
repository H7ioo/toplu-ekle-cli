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
import { HepsiburadaMainFields } from "../prompts";
import { HepsiburadaMainOptions } from "../types";
import { HEPSIBURADA_SUFFIX } from "../variables";
import {
  EarphoneFieldsOptions,
  EarphoneFieldsScheme,
  EarphoneOptions,
  EarphoneOptionsScheme,
} from "./types";
import {
  Earphone_CableLength,
  Earphone_Colors,
  Earphone_Colors2,
  Earphone_Connections,
  Earphone_Microphone,
  Earphone_Models,
  Earphone_NoiseCancel,
  Earphone_PackageContent,
  Earphone_UsageCases,
  Earphone_UsageTypes,
} from "./variables";

const CATEGORY_NAME: keyof (typeof sheetNames)["hepsiburada"] =
  "earphone" as const;
type OPTIONS_TYPE = EarphoneOptions;
const OPTIONS_SCHEME = EarphoneOptionsScheme;
type FIELDS_TYPE = EarphoneFieldsOptions;
const FIELDS_SCHEME = EarphoneFieldsScheme;

export async function earphone(
  productMainOptions: ProductMainOptions,
  companyMainOptions: HepsiburadaMainOptions
) {
  const promptQuestions: QuestionCollection<OPTIONS_TYPE> = [
    {
      type: "search-checkbox",
      name: "colors",
      message: "Renkleri seçiniz",
      choices: Earphone_Colors,
      validate: (input) => lengthValidator(input, true),
      suffix: HEPSIBURADA_SUFFIX,
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
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "model",
      message: "Kulaklık modeli seçiniz",
      choices: Earphone_Models,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "connection",
      message: "Bağlantı seçiniz",
      choices: Earphone_Connections,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "microphone",
      message: "Mikrofon seçiniz",
      choices: Earphone_Microphone,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "usageType",
      message: "Kullanım tipi seçeniz",
      choices: Earphone_UsageTypes,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "usageCases",
      message: "Kullanım alanı seçeniz",
      choices: Earphone_UsageCases,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "noiseCancel",
      message: "Gürültü önleme seçeniz",
      choices: Earphone_NoiseCancel,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "cableLength",
      message: "Kablo uzunluğu seçeniz",
      choices: Earphone_CableLength,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "packageContent",
      message: "Paket içeriği seçeniz",
      choices: Earphone_PackageContent,
      suffix: HEPSIBURADA_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  const products: FIELDS_TYPE[] = [];

  // # Colors Loop
  for (let c = 0; c < result.colors.length; c++) {
    const color = result.colors[c] as (typeof Earphone_Colors)[number];

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
        Renk2: Earphone_Colors2.includes(
          color as (typeof Earphone_Colors2)[number]
        )
          ? (color as (typeof Earphone_Colors2)[number])
          : "",
        "Kulaklık Modeli": result.model,
        Renk: color,
        Bağlantı: result.connection,
        Mikrofon: result.microphone,
        "Kullanım Tipi": result.usageType,
        "Kullanım Alanı": result.usageCases,
        "Gürültü Önleme": replaceEmptyOptionWithString(result.noiseCancel),
        "Kablo Uzunluğu": replaceEmptyOptionWithString(result.cableLength),
        "Paket İçeriği": replaceEmptyOptionWithString(result.packageContent),
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
