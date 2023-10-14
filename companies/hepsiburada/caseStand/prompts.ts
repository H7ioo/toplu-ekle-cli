import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
import {
  capitalizeLetters,
  cleanUp,
  generateGTIN,
  lengthValidator,
  removeWhiteSpaces,
} from "../../../lib/utils";
import { sheetNames } from "../../../lib/variables";
import { HepsiburadaMainFields } from "../prompts";
import { HepsiburadaMainOptions } from "../types";
import { HEPSIBURADA_SUFFIX } from "../variables";
import {
  CaseStandFieldsOptions,
  CaseStandFieldsScheme,
  CaseStandOptions,
  CaseStandOptionsScheme,
} from "./types";
import {
  CaseStand_ColorProductType,
  CaseStand_ColorVariant,
} from "./variables";

const CATEGORY_NAME: keyof (typeof sheetNames)["hepsiburada"] =
  "caseStand" as const;
type OPTIONS_TYPE = CaseStandOptions;
const OPTIONS_SCHEME = CaseStandOptionsScheme;
type FIELDS_TYPE = CaseStandFieldsOptions;
const FIELDS_SCHEME = CaseStandFieldsScheme;

export async function caseStand(
  productMainOptions: ProductMainOptions,
  companyMainOptions: HepsiburadaMainOptions
) {
  const promptQuestions: QuestionCollection<OPTIONS_TYPE> = [
    {
      type: "search-checkbox",
      name: "colors",
      message: "Renk seçiniz",
      choices: CaseStand_ColorProductType,
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
      validate: (input) => lengthValidator(input, true),
      suffix: HEPSIBURADA_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  const products: FIELDS_TYPE[] = [];

  // # Options Loop
  for (let o = 0; o < result.options.length; o++) {
    const option = result.options[o] as string;

    // # Colors Loop
    for (let c = 0; c < result.colors.length; c++) {
      const color = result.colors[
        c
      ] as (typeof CaseStand_ColorProductType)[number];

      // Example: Astronot Standlı Aparat vs.
      const productTitle = `${productMainOptions.productTitle}`;

      // Example: SB-11Pro
      const productModalCode = `${productMainOptions.productCode}`;

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
        Renk2: CaseStand_ColorVariant.includes(
          color as (typeof CaseStand_ColorVariant)[number]
        )
          ? (color as (typeof CaseStand_ColorVariant)[number])
          : "",
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
