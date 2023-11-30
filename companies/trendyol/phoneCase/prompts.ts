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
  returnDataFile,
} from "../../../lib/utils";
import { sheetNames } from "../../../lib/variables";
import { TrendyolMainFields } from "../prompts";
import { TrendyolMainOptions } from "../types";
import { TRENDYOL_SUFFIX } from "../variables";
import {
  PhoneCaseFieldsOptions,
  PhoneCaseFieldsScheme,
  PhoneCaseOptions,
  PhoneCaseOptionsScheme,
} from "./types";
import {
  PhoneCase_CaseMaterials,
  PhoneCase_CaseTypes,
  PhoneCase_GuaranteePeriods,
  PhoneCase_PhoneBrands,
  PhoneCase_PhonesList,
  PhoneCase_PhonesListExtend,
} from "./variables";

const CATEGORY_ID = 766 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "phoneCase" as const;
type OPTIONS_TYPE = PhoneCaseOptions;
const OPTIONS_SCHEME = PhoneCaseOptionsScheme;
type FIELDS_TYPE = PhoneCaseFieldsOptions;
const FIELDS_SCHEME = PhoneCaseFieldsScheme;

export async function phoneCase(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {
  const collectionData = returnDataFile("collections");

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
      type: "checkbox",
      name: "phonesCollection",
      message: "Koleksiyon seçiniz",
      choices: collectionData
        .filter(
          (collection) =>
            collection.company === "trendyol" &&
            collection.category === CATEGORY_NAME
        )
        .map((collection) => collection.collectionName),
      filter: (input: string[]) => {
        return input
          .map(
            (collectionName) =>
              collectionData.find(
                (collection) =>
                  collection.company === "trendyol" &&
                  collection.category === CATEGORY_NAME &&
                  collection.collectionName === collectionName
              )!.values
          )
          .flat(1);
      },
      when:
        collectionData.find(
          (collection) =>
            collection.company === "trendyol" &&
            collection.category === CATEGORY_NAME
        ) !== undefined,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-checkbox",
      name: "phonesList",
      message: `Telefon modelleri seçiniz`,
      choices: [...PhoneCase_PhonesList, ...PhoneCase_PhonesListExtend],
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "input",
      name: "customPhonesList",
      message: `Telefon modelleri yazınız (aralarında virgül koyarak)`,
      filter: (input: string) => {
        if (!lengthValidator(input)) return [];
        return cleanUp(input, false)
          .split(",")
          .map((phone) => {
            // return capitalizeLetters(phone).replace(/iphone/gi, "iPhone");
            return phone.trim();
          });
      },
      validate: (input, answers) => {
        if (
          !answers?.phonesCollection?.length &&
          !answers?.phonesList.length &&
          input.length <= 0
        ) {
          return "Toplam en az 1 telefon modeli eklenmeli";
        }
        return true;
      },
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "caseMaterial",
      message: "Materyal seçiniz",
      choices: PhoneCase_CaseMaterials,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "caseType",
      message: "Kılıf modeli seçiniz",
      choices: PhoneCase_CaseTypes,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "guaranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: PhoneCase_GuaranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "phoneBrand",
      message: "Uyumlu marka seçiniz",
      choices: PhoneCase_PhoneBrands,
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

    // # Phones Loop
    for (
      let p = 0;
      p <
      [
        ...result.phonesList,
        ...result.customPhonesList,
        ...(result.phonesCollection ? result.phonesCollection : ""),
      ].length;
      p++
    ) {
      const phone = [
        ...result.phonesList,
        ...result.customPhonesList,
        ...(result.phonesCollection ? result.phonesCollection : ""),
      ][p] as (typeof PhoneCase_PhonesList)[number];
      // Galaxy A12 or A12 based on the input
      const phoneWithoutTheBrand = capitalizeLetters(
        cleanUp(replaceTurkishI(phone).toLowerCase().replace(regex, ""), false)
      );

      // 11Pro, GalaxyA12, A12
      const phoneCode = removeWhiteSpaces(phoneWithoutTheBrand);

      // Example: iPhone 11 Pro Uyumlu I Love Your Mom
      const productTitle = `${
        result.productKnownBrandName
      } ${phoneWithoutTheBrand} Uyumlu ${
        result.includeOptionInTitle ? `${color} ` : ""
      }${productMainOptions.productTitle}`;

      // Example: SB-11Pro
      const productModalCode = `${productMainOptions.productCode}-${phoneCode}`;

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
        Materyal: replaceEmptyOptionWithString(result.caseMaterial) ?? "",
        Model: replaceEmptyOptionWithString(result.caseType) ?? "",
        "Cep Telefonu Modeli": PhoneCase_PhonesList.includes(phone)
          ? phone
          : "",
        "Garanti Tipi":
          replaceEmptyOptionWithString(result.guaranteeType) ?? "",
        "Garanti Süresi":
          replaceEmptyOptionWithString(result.guaranteePeriod) ?? "",
        "Uyumlu Marka": replaceEmptyOptionWithString(result.phoneBrand) ?? "",
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
