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
  ScreenProtectorFieldsOptions,
  ScreenProtectorFieldsScheme,
  ScreenProtectorOptions,
  ScreenProtectorOptionsScheme,
} from "./types";
import {
  ScreenProtector_GuaranteePeriods,
  ScreenProtector_PhoneBrands,
  ScreenProtector_PhonesList,
  ScreenProtector_PhonesListExtend,
} from "./variables";

// TODO: We can make option like Hayalet ve Normal

const CATEGORY_ID = 2860 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "screenProtector" as const;
type OPTIONS_TYPE = ScreenProtectorOptions;
const OPTIONS_SCHEME = ScreenProtectorOptionsScheme;
type FIELDS_TYPE = ScreenProtectorFieldsOptions;
const FIELDS_SCHEME = ScreenProtectorFieldsScheme;

export async function screenProtector(
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
      type: "search-checkbox",
      name: "phonesList",
      message: `Telefon modelleri seçiniz`,
      choices: [
        ...ScreenProtector_PhonesList,
        ...ScreenProtector_PhonesListExtend,
      ],
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "input",
      name: "customPhonesList",
      message: `Telefon modelleri yazınız (aralarında virgül koyarak)`,
      filter: (input: string) => {
        if (!lengthValidator(input)) return [];
        return cleanUp(input)
          .split(",")
          .map((phone) => {
            return capitalizeLetters(phone);
          });
      },
      validate: (input, answers) => {
        if (answers?.phonesList) {
          if (answers.phonesList.length <= 0 && input.length <= 0)
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
      name: "guaranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: ScreenProtector_GuaranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "phoneBrand",
      message: "Uyumlu marka seçiniz",
      choices: ScreenProtector_PhoneBrands,
      suffix: TRENDYOL_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  // Regex made to remove Samsung from "Samsung Galaxy A12"
  const regex = removePhoneBrandRegEx(result.productKnownBrandName);

  const products: FIELDS_TYPE[] = [];

  // # Phones Loop
  for (
    let p = 0;
    p < [...result.phonesList, ...result.customPhonesList].length;
    p++
  ) {
    // TODO: String | Undefined
    const phone = [...result.phonesList, ...result.customPhonesList][
      p
    ] as (typeof ScreenProtector_PhonesList)[number];
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
      "Cep Telefonu Modeli": ScreenProtector_PhonesList.includes(phone)
        ? phone
        : "",
      "Garanti Süresi": result.guaranteePeriod,
      "Uyumlu Marka": replaceEmptyOptionWithString(result.phoneBrand) ?? "",
    };

    FIELDS_SCHEME.parse(fields);

    products.push(fields);
  }

  return {
    products,
    category: CATEGORY_NAME,
    productKnownBrandName: result.productKnownBrandName,
  };
}
