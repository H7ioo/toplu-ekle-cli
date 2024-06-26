import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
import {
  capitalizeLetters,
  cleanUp,
  generateGTIN,
  lengthValidator,
  replaceEmptyOptionWithString,
} from "../../../lib/utils";
import { sheetNames } from "../../../lib/variables";
import { TrendyolMainFields } from "../prompts";
import { TrendyolMainOptions } from "../types";
import { TRENDYOL_SUFFIX } from "../variables";
import {
  InCarPhoneHolderFieldsOptions,
  InCarPhoneHolderFieldsScheme,
  InCarPhoneHolderOptions,
  InCarPhoneHolderOptionsScheme,
} from "./types";
import {
  InCarPhoneHolder_GuaranteePeriods,
  InCarPhoneHolder_Material,
  InCarPhoneHolder_StandProperties,
  InCarPhoneHolder_Type,
} from "./variables";

const CATEGORY_ID = 1056 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "inCarPhoneHolder" as const;
type OPTIONS_TYPE = InCarPhoneHolderOptions;
const OPTIONS_SCHEME = InCarPhoneHolderOptionsScheme;
type FIELDS_TYPE = InCarPhoneHolderFieldsOptions;
const FIELDS_SCHEME = InCarPhoneHolderFieldsScheme;

export async function inCarPhoneHolder(
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
      type: "search-list",
      name: "guaranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: InCarPhoneHolder_GuaranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "standProperty",
      message: "Özellik seçiniz",
      choices: InCarPhoneHolder_StandProperties,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "standType",
      message: "Tür seçiniz",
      choices: InCarPhoneHolder_Type,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "material",
      message: "Materyal seçiniz",
      choices: InCarPhoneHolder_Material,
      suffix: TRENDYOL_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  const products: FIELDS_TYPE[] = [];

  // # Colors Loop
  for (let c = 0; c < result.colors.length; c++) {
    const color = result.colors[c] as string;

    // Example: Astronot Standlı Aparat vs.
    const productTitle = `${productMainOptions.productTitle}`;

    // Example: SB-11Pro
    const productModalCode = `${productMainOptions.productCode}`;

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
      "Telefon Tutucu Özellikleri":
        replaceEmptyOptionWithString(result.standProperty) ?? "",
      Renk: color,
      "Garanti Süresi": result.guaranteePeriod,
      Türü: replaceEmptyOptionWithString(result.standType) ?? "",
      Materyal: replaceEmptyOptionWithString(result.material) ?? "",
    };

    FIELDS_SCHEME.parse(fields);

    products.push(fields);
  }

  return {
    products,
    category: CATEGORY_NAME,
    productKnownBrandName: undefined,
  };
}
