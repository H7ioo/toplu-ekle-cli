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
  HeadphoneCaseOptions,
  HeadphoneCaseOptionsScheme,
  HeadphoneFieldsOptions,
  HeadphoneFieldsScheme,
} from "./types";
import {
  HeadphoneCase_CustomHeadphonesList,
  HeadphoneCase_GuaranteePeriods,
  HeadphoneCase_HeadPhoneBrands,
  HeadphoneCase_HeadphonesList,
} from "./variables";

const CATEGORY_ID = 3494 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "headphoneCase" as const;
type OPTIONS_TYPE = HeadphoneCaseOptions;
const OPTIONS_SCHEME = HeadphoneCaseOptionsScheme;
type FIELDS_TYPE = HeadphoneFieldsOptions;
const FIELDS_SCHEME = HeadphoneFieldsScheme;

export async function headphoneCase(
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
      name: "headPhonesList",
      message: `Kulaklık modelleri seçiniz`,
      choices: [
        ...HeadphoneCase_CustomHeadphonesList,
        ...HeadphoneCase_HeadphonesList,
      ],
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "input",
      name: "customHeadPhoneList",
      message: `Kulaklık modelleri yazınız (aralarında virgül koyarak)`,
      filter: (input: string) => {
        if (!lengthValidator(input)) return [];
        return cleanUp(input)
          .split(",")
          .map((phone) => {
            return capitalizeLetters(phone);
          });
      },
      validate: (input, answers) => {
        if (answers?.headPhonesList) {
          if (answers.headPhonesList.length <= 0 && input.length <= 0)
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
      choices: HeadphoneCase_GuaranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "headPhoneBrand",
      message: "Uyumlu marka seçiniz",
      choices: HeadphoneCase_HeadPhoneBrands,
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

    // # Headphones Loop
    for (
      let p = 0;
      p < [...result.headPhonesList, ...result.customHeadPhoneList].length;
      p++
    ) {
      const headPhone = [
        ...result.headPhonesList,
        ...result.customHeadPhoneList,
      ][p] as (typeof HeadphoneCase_HeadphonesList)[number];
      // Galaxy A12 or A12 based on the input
      const headPhoneWithoutTheBrand = capitalizeLetters(
        cleanUp(
          replaceTurkishI(headPhone).toLowerCase().replace(regex, ""),
          false
        )
      );
      // MainModalCode = XYKK, StockCode = ABCD
      let [mainModelCode, productCode] =
        productMainOptions.productCode.split("-");
      if (!productCode) productCode = mainModelCode;

      // 11Pro, GalaxyA12, A12
      const headphoneCode = removeWhiteSpaces(headPhoneWithoutTheBrand);

      // Example: iPhone 11 Pro Uyumlu I Love Your Mom
      // ! Airpods should not be in the title for some reason
      const productTitle = `${
        result.productKnownBrandName
      } ${headPhoneWithoutTheBrand} Uyumlu ${
        result.includeOptionInTitle ? `${color} ` : ""
      }${productMainOptions.productTitle}`.replace("Airpods", "Arpds");

      // Example: SB-11Pro
      // const productModalCode = `${productMainOptions.productCode}-${headphoneCode}`;
      const productModalCode = `${mainModelCode}-${headphoneCode}`;

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
          productCode: productCode!,
          shipmentTime: companyMainOptions.shipmentTime,
          shipmentType: companyMainOptions.shipmentType,
          stockAmount: productMainOptions.stockAmount,
        }),
        Renk: color,
        "Garanti Süresi": result.guaranteePeriod,
        "Uyumlu Marka":
          replaceEmptyOptionWithString(result.headPhoneBrand) ?? "",
        "Uyumlu Model": HeadphoneCase_HeadphonesList.includes(headPhone)
          ? headPhone
          : "",
      };

      FIELDS_SCHEME.parse(fields);

      products.push(fields);
    }
  }

  return {
    products,
    category: CATEGORY_NAME,
    productKnownBrandName: result.productKnownBrandName,
  };
}
