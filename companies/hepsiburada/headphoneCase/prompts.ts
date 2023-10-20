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
import { HepsiburadaMainFields } from "../prompts";
import { HepsiburadaMainOptions } from "../types";
import { HEPSIBURADA_SUFFIX } from "../variables";
import {
  HeadphoneCaseOptions,
  HeadphoneCaseOptionsScheme,
  HeadphoneFieldsOptions,
  HeadphoneFieldsScheme,
} from "./types";
import {
  HeadphoneCase_Colors,
  HeadphoneCase_CustomHeadphonesList,
  HeadphoneCase_HeadphoneAccessoryType,
} from "./variables";

const CATEGORY_NAME: keyof (typeof sheetNames)["hepsiburada"] =
  "headphoneCase" as const;
type OPTIONS_TYPE = HeadphoneCaseOptions;
const OPTIONS_SCHEME = HeadphoneCaseOptionsScheme;
type FIELDS_TYPE = HeadphoneFieldsOptions;
const FIELDS_SCHEME = HeadphoneFieldsScheme;

export async function headphoneCase(
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
      message: "Renkleri seçiniz",
      choices: HeadphoneCase_Colors,
      validate: (input) => lengthValidator(input, true),
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-checkbox",
      name: "headPhonesList",
      message: `Kulaklık modelleri seçiniz`,
      choices: HeadphoneCase_CustomHeadphonesList,
      suffix: HEPSIBURADA_SUFFIX,
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
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      type: "search-list",
      name: "accessoryType",
      message: "Aksesuar türü seçiniz",
      choices: HeadphoneCase_HeadphoneAccessoryType,
      suffix: HEPSIBURADA_SUFFIX,
    },
  ];
  const result = await prompt<OPTIONS_TYPE>(promptQuestions);

  OPTIONS_SCHEME.parse(result);

  // Regex made to remove Samsung from "Samsung Galaxy A12"
  const regex = removePhoneBrandRegEx(result.productKnownBrandName);

  const products: FIELDS_TYPE[] = [];

  // # Colors Loop
  for (let c = 0; c < result.colors.length; c++) {
    const color = result.colors[c] as (typeof HeadphoneCase_Colors)[number];

    // # Headphones Loop
    for (
      let p = 0;
      p < [...result.headPhonesList, ...result.customHeadPhoneList].length;
      p++
    ) {
      const headPhone = [
        ...result.headPhonesList,
        ...result.customHeadPhoneList,
      ][p] as (typeof HeadphoneCase_CustomHeadphonesList)[number];
      // Galaxy A12 or A12 based on the input
      const headPhoneWithoutTheBrand = capitalizeLetters(
        cleanUp(
          replaceTurkishI(headPhone).toLowerCase().replace(regex, ""),
          false
        )
      );

      // 11Pro, GalaxyA12, A12
      const headphoneCode = removeWhiteSpaces(headPhoneWithoutTheBrand);

      // Example: iPhone 11 Pro Uyumlu I Love Your Mom
      // ! Airpods should not be in the title for some reason
      const productTitle =
        `${result.productKnownBrandName} ${headPhoneWithoutTheBrand} Uyumlu ${productMainOptions.productTitle}`.replace(
          "Airpods",
          "Arpds"
        );

      // Example: SB-11Pro
      const productModalCode = `${productMainOptions.productCode}-${headphoneCode}`;

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
        Renk: replaceEmptyOptionWithString(color),
        "Kulaklık Aksesuarı Türü": result.accessoryType,
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
