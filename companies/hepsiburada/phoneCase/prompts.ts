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
import { HepsiburadaMainFields } from "../prompts";
import { HepsiburadaMainOptions } from "../types";
import { HEPSIBURADA_SUFFIX } from "../variables";
import {
  PhoneCaseFieldsOptions,
  PhoneCaseFieldsScheme,
  PhoneCaseOptions,
  PhoneCaseOptionsScheme,
} from "./types";
import {
  PhoneCase_CaseMaterials,
  PhoneCase_CaseTypes,
  PhoneCase_Colors,
  PhoneCase_GuaranteeTypes,
  PhoneCase_PhoneBrands,
  PhoneCase_PhoneModelsList,
  PhoneCase_PhonesList,
  PhoneCase_PhonesListCode,
  PhoneCase_PhonesListExtend,
  PhoneCase_WaterProof,
} from "./variables";

const CATEGORY_NAME: keyof (typeof sheetNames)["hepsiburada"] =
  "phoneCase" as const;
type OPTIONS_TYPE = PhoneCaseOptions;
const OPTIONS_SCHEME = PhoneCaseOptionsScheme;
type FIELDS_TYPE = PhoneCaseFieldsOptions;
const FIELDS_SCHEME = PhoneCaseFieldsScheme;

export async function phoneCase(
  productMainOptions: ProductMainOptions,
  companyMainOptions: HepsiburadaMainOptions
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
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-checkbox",
      name: "colors",
      message: "Renkleri seçiniz",
      choices: PhoneCase_Colors,
      validate: (input) => lengthValidator(input, true),
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "checkbox",
      name: "phonesCollection",
      message: "Koleksiyon seçiniz",
      choices: collectionData
        .filter(
          (collection) =>
            collection.company === "hepsiburada" &&
            collection.category === CATEGORY_NAME
        )
        .map((collection) => collection.collectionName),
      filter: (input: string[]) => {
        return input
          .map(
            (collectionName) =>
              collectionData.find(
                (collection) =>
                  collection.company === "hepsiburada" &&
                  collection.category === CATEGORY_NAME &&
                  collection.collectionName === collectionName
              )!.values
          )
          .flat(1);
      },
      when:
        collectionData.find(
          (collection) =>
            collection.company === "hepsiburada" &&
            collection.category === CATEGORY_NAME
        ) !== undefined,
      suffix: HEPSIBURADA_SUFFIX,
    },

    {
      type: "search-checkbox",
      name: "phonesList",
      message: `Telefon modelleri seçiniz`,
      choices: [...PhoneCase_PhonesList, ...PhoneCase_PhonesListExtend],
      suffix: HEPSIBURADA_SUFFIX,
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
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "caseMaterial",
      message: "Materyal seçiniz",
      choices: PhoneCase_CaseMaterials,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "caseType",
      message: "Kılıf modeli seçiniz",
      choices: PhoneCase_CaseTypes,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "guaranteeType",
      message: "Garanti türü seçiniz",
      choices: PhoneCase_GuaranteeTypes,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "phoneBrand",
      message: "Uyumlu marka seçiniz",
      choices: PhoneCase_PhoneBrands,
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "phoneWaterProof",
      message: "Su geçirmezlik seçiniz",
      choices: PhoneCase_WaterProof,
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
    {
      type: "confirm",
      name: "includeOptionInTitle",
      message: "Seçenek ürünün başlığında yer alsın mı?",
      default: false,
      suffix: HEPSIBURADA_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  // Regex made to remove Samsung from "Samsung Galaxy A12"
  const regex = removePhoneBrandRegEx(result.productKnownBrandName);

  const products: FIELDS_TYPE[] = [];

  // It contains 1 loop = [''] so it will do the loop
  // # Options Loop
  for (let o = 0; o < result.options.length; o++) {
    const option = result.options[o] as string;

    // # Colors Loop
    for (let c = 0; c < result.colors.length; c++) {
      const color = result.colors[c] as (typeof PhoneCase_Colors)[number];

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
          cleanUp(
            replaceTurkishI(phone).toLowerCase().replace(regex, ""),
            false
          )
        );

        // 11Pro, GalaxyA12, A12
        const phoneCode = removeWhiteSpaces(phoneWithoutTheBrand);

        // Example: iPhone 11 Pro Uyumlu I Love Your Mom
        const productTitle = `${
          result.productKnownBrandName
        } ${phoneWithoutTheBrand} Uyumlu ${
          result.includeOptionInTitle ? `${option} ` : ""
        }${productMainOptions.productTitle}`;

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
          "Uyumlu Model": PhoneCase_PhoneModelsList.includes(
            phone as (typeof PhoneCase_PhoneModelsList)[number]
          )
            ? (phone as (typeof PhoneCase_PhoneModelsList)[number])
            : "",
          Renk: replaceEmptyOptionWithString(color),
          Seçenek: option,
          // TODO: What if used from Extend List?
          "Telefon Modeli": phone,
          "Uyumlu Marka": result.phoneBrand,
          "Garanti Tipi":
            replaceEmptyOptionWithString(result.guaranteeType) ?? "",
          "Su Geçirmezlik":
            replaceEmptyOptionWithString(result.phoneWaterProof) ?? "",
          "Ürün  Kodu": PhoneCase_PhonesListCode.includes(
            phone as (typeof PhoneCase_PhonesListCode)[number]
          )
            ? (phone as (typeof PhoneCase_PhonesListCode)[number])
            : "",
          "Malzeme Türü":
            replaceEmptyOptionWithString(result.caseMaterial) ?? "",
          "Garanti Tipi2":
            replaceEmptyOptionWithString(result.guaranteeType) ?? "",

          "Kılıf Tipi": replaceEmptyOptionWithString(result.caseType) ?? "",
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
