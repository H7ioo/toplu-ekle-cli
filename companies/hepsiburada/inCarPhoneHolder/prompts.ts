import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
import {
  generateGTIN,
  lengthValidator,
  removeWhiteSpaces,
} from "../../../lib/utils";
import { sheetNames } from "../../../lib/variables";
import { HepsiburadaMainFields } from "../prompts";
import { HepsiburadaMainOptions } from "../types";
import { HEPSIBURADA_SUFFIX } from "../variables";
import {
  InCarPhoneHolderFieldsOptions,
  InCarPhoneHolderFieldsScheme,
  InCarPhoneHolderOptions,
  InCarPhoneHolderOptionsScheme,
} from "./types";
import { InCarPhoneHolder_Colors, InCarPhoneHolder_Type } from "./variables";

const CATEGORY_NAME: keyof (typeof sheetNames)["hepsiburada"] =
  "inCarPhoneHolder" as const;
type OPTIONS_TYPE = InCarPhoneHolderOptions;
const OPTIONS_SCHEME = InCarPhoneHolderOptionsScheme;
type FIELDS_TYPE = InCarPhoneHolderFieldsOptions;
const FIELDS_SCHEME = InCarPhoneHolderFieldsScheme;

export async function inCarPhoneHolder(
  productMainOptions: ProductMainOptions,
  companyMainOptions: HepsiburadaMainOptions
) {
  const promptQuestions: QuestionCollection<OPTIONS_TYPE> = [
    {
      type: "search-checkbox",
      name: "colors",
      message: "Renkleri seçiniz",
      choices: InCarPhoneHolder_Colors,
      validate: (input) => lengthValidator(input, true),
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "standType",
      message: "Tür seçiniz",
      choices: InCarPhoneHolder_Type,
      suffix: HEPSIBURADA_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  const products: FIELDS_TYPE[] = [];

  // # Colors Loop
  for (let c = 0; c < result.colors.length; c++) {
    const color = result.colors[c] as (typeof InCarPhoneHolder_Colors)[number];

    // Example: Astronot Standlı Aparat vs.
    const productTitle = `${productMainOptions.productTitle}`;

    // Example: SB-11Pro
    const productModalCode = `${productMainOptions.productCode}`;

    const productCodeForHepsiburada = `${productModalCode}-${removeWhiteSpaces(
      color
    )}`.toUpperCase();

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
      Türü: result.standType,
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
