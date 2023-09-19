import { QuestionCollection, prompt } from "inquirer";
import { ProductMainOptions } from "../../../lib/types";
import { TrendyolMainOptions } from "../types";
import {
  HeadphoneCaseOptions,
  HeadphoneCaseOptionsScheme,
  HeadphoneFieldsOptions,
  HeadphoneFieldsScheme,
} from "./types";
import {
  cleanUp,
  lengthValidator,
  capitalizeLetters,
  removePhoneBrandRegEx,
  replaceTurkishI,
  removeWhiteSpaces,
  generateGTIN,
  replaceEmptyOptionWithString,
} from "../../../lib/utils";
import { sheetNames, KDV } from "../../../lib/variables";
import { PhoneCase_PhonesList } from "../phoneCase/variables";
import {
  HeadphoneCase_HeadphonesList,
  HeadphoneCase_GuaranteePeriods,
  HeadphoneCase_HeadPhoneBrands,
} from "./variables";
import { TRENDYOL_SUFFIX } from "../variables";
import { TrendyolMainFields } from "../prompts";

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
      choices: HeadphoneCase_HeadphonesList,
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
      name: "guranteePeriod",
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
      // TODO: String | Undefined
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

      // 11Pro, GalaxyA12, A12
      const headphoneCode = removeWhiteSpaces(headPhoneWithoutTheBrand);

      // Example: iPhone 11 Pro Uyumlu I Love Your Mom
      const productTitle = `${result.productKnownBrandName} ${headPhoneWithoutTheBrand} Uyumlu ${productMainOptions.productTitle}`;

      // Example: SB-11Pro
      const productModalCode = `${productMainOptions.productCode}-${headphoneCode}`;

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
        Renk: color,
        "Garanti Süresi": result.guranteePeriod,
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

  return { products, category: CATEGORY_NAME };
}

// TODO: replaceEmptyOptionWithString remove duplicates
