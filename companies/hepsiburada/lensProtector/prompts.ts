import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
import {
  capitalizeLetters,
  cleanUp,
  generateGTIN,
  lengthValidator,
  removePhoneBrandRegEx,
  removeWhiteSpaces,
  replaceTurkishI,
} from "../../../lib/utils";
import { sheetNames } from "../../../lib/variables";
import { HepsiburadaMainFields } from "../prompts";
import { HepsiburadaMainOptions } from "../types";
import { HEPSIBURADA_SUFFIX } from "../variables";
import {
  LensProtectorFieldsOptions,
  LensProtectorFieldsScheme,
  LensProtectorOptions,
  LensProtectorOptionsScheme,
} from "./types";
import {
  LensProtector_ColorProductType,
  LensProtector_ColorVariant,
} from "./variables";
import {
  PhoneCase_PhonesList,
  PhoneCase_PhonesListExtend,
} from "../phoneCase/variables";

const CATEGORY_NAME: keyof (typeof sheetNames)["hepsiburada"] =
  "lensProtector" as const;
type OPTIONS_TYPE = LensProtectorOptions;
const OPTIONS_SCHEME = LensProtectorOptionsScheme;
type FIELDS_TYPE = LensProtectorFieldsOptions;
const FIELDS_SCHEME = LensProtectorFieldsScheme;

export async function lensProtector(
  productMainOptions: ProductMainOptions,
  companyMainOptions: HepsiburadaMainOptions
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
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-checkbox",
      name: "colors",
      message: "Renk seçiniz",
      choices: LensProtector_ColorProductType,
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
      suffix: HEPSIBURADA_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  // Regex made to remove Samsung from "Samsung Galaxy A12"
  const regex = removePhoneBrandRegEx(result.productKnownBrandName);

  const products: FIELDS_TYPE[] = [];

  // # Options Loop
  for (let o = 0; o < result.options.length; o++) {
    const option = result.options[o] as string;

    // # Colors Loop
    for (let c = 0; c < result.colors.length; c++) {
      const color = result.colors[
        c
      ] as (typeof LensProtector_ColorProductType)[number];

      // # Phones Loop
      for (
        let p = 0;
        p < [...result.phonesList, ...result.customPhonesList].length;
        p++
      ) {
        const phone = [...result.phonesList, ...result.customPhonesList][
          p
        ] as (typeof PhoneCase_PhonesList)[number];
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
        const productTitle = `${result.productKnownBrandName} ${phoneWithoutTheBrand} Uyumlu ${productMainOptions.productTitle}`;

        // Example: SB-11Pro
        const productModalCode = `${productMainOptions.productCode}-${phoneCode}`;

        const barcode = generateGTIN(companyMainOptions.trademark);

        const productCodeForHepsiburada =
          `${productModalCode}-${removeWhiteSpaces(color)}`.toUpperCase();

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
          Renk2: LensProtector_ColorVariant.includes(
            color as (typeof LensProtector_ColorVariant)[number]
          )
            ? (color as (typeof LensProtector_ColorVariant)[number])
            : "",
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
