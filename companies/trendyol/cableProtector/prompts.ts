import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
import {
  capitalizeLetters,
  cleanUp,
  generateGTIN,
  lengthValidator,
  removeWhiteSpaces,
  replaceEmptyOptionWithString,
} from "../../../lib/utils";
import { sheetNames } from "../../../lib/variables";
import { TrendyolMainFields } from "../prompts";
import { TrendyolMainOptions } from "../types";
import { TRENDYOL_SUFFIX } from "../variables";
import {
  CableProtectorFieldsOptions,
  CableProtectorFieldsScheme,
  CableProtectorOptions,
  CableProtectorOptionsScheme,
} from "./types";
import {
  CableProtector_GuaranteePeriods,
  CableProtector_GuaranteeTypes,
  CableProtector_ProdcutTypes,
} from "./variables";

const CATEGORY_ID = 5505 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "cableProtector" as const;
type OPTIONS_TYPE = CableProtectorOptions;
const OPTIONS_SCHEME = CableProtectorOptionsScheme;
type FIELDS_TYPE = CableProtectorFieldsOptions;
const FIELDS_SCHEME = CableProtectorFieldsScheme;

export async function cableProtector(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {
  const promptQuestions: QuestionCollection<OPTIONS_TYPE> = [
    {
      type: "input",
      name: "productKnownBrandName",
      message:
        "Markanın bilinen adı ve *watt bilgisi yazınız (ör. iPhone 18-20w, iPhone, Apple)",
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
      type: "search-list",
      name: "guaranteeType",
      message: "Garanti tipi seçiniz",
      choices: CableProtector_GuaranteeTypes,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "guaranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: CableProtector_GuaranteePeriods,
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "productType",
      message: "Ürün tipi seçiniz",
      choices: CableProtector_ProdcutTypes,
      suffix: TRENDYOL_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  const products: FIELDS_TYPE[] = [];

  // # Colors Loop
  for (let c = 0; c < result.colors.length; c++) {
    const color = result.colors[c] as string;

    // Apple, iPhone18-20W
    const phoneCode = removeWhiteSpaces(result.productKnownBrandName);

    // Example: Apple 18-20W Uyumlu ...
    const productTitle = `${result.productKnownBrandName} ${
      result.productType === "Adaptör ve Kablo Koruyucu Set"
        ? "Şarj Adaptörü"
        : ""
    } ile Uyumlu ${productMainOptions.productTitle}`;

    // Example: SB-Apple
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
      "Garanti Tipi": replaceEmptyOptionWithString(result.guaranteeType) ?? "",
      "Garanti Süresi": result.guaranteePeriod,
      "Ürün Tipi": result.productType,
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
