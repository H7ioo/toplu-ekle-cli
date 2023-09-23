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
import { TrendyolMainFields } from "../prompts";
import { TrendyolMainOptions } from "../types";
import { TRENDYOL_SUFFIX } from "../variables";
import {
  LensProtectorFieldsOptions,
  LensProtectorFieldsScheme,
  LensProtectorOptions,
  LensProtectorOptionsScheme,
} from "./types";
import {
  LensProtector_CustomPhonesList,
  LensProtector_PhoneBrands,
} from "./variables";

const CATEGORY_ID = 5511 as const;
const CATEGORY_NAME: keyof (typeof sheetNames)["trendyol"] =
  "lensProtector" as const;
type OPTIONS_TYPE = LensProtectorOptions;
const OPTIONS_SCHEME = LensProtectorOptionsScheme;
type FIELDS_TYPE = LensProtectorFieldsOptions;
const FIELDS_SCHEME = LensProtectorFieldsScheme;

export async function lensProtector(
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
      name: "phonesList",
      message: `Telefon modelleri seçiniz`,
      choices: [...LensProtector_CustomPhonesList],
      suffix: TRENDYOL_SUFFIX,
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
      suffix: TRENDYOL_SUFFIX,
    },
    {
      type: "search-list",
      name: "phoneBrand",
      message: "Uyumlu marka seçiniz",
      choices: LensProtector_PhoneBrands,
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
      p < [...result.phonesList, ...result.customPhonesList].length;
      p++
    ) {
      // TODO: String | Undefined
      const phone = [...result.phonesList, ...result.customPhonesList][
        p
      ] as (typeof LensProtector_CustomPhonesList)[number];
      // Galaxy A12 or A12 based on the input
      const phoneWithoutTheBrand = capitalizeLetters(
        cleanUp(replaceTurkishI(phone).toLowerCase().replace(regex, ""), false)
      );

      // 11Pro, GalaxyA12, A12
      const phoneCode = removeWhiteSpaces(phoneWithoutTheBrand);

      // Example: iPhone 11 Pro Uyumlu I Love Your Mom
      const productTitle = `${result.productKnownBrandName} ${phoneWithoutTheBrand} Uyumlu ${productMainOptions.productTitle}`;

      // Example: SB-11Pro
      const productModalCode = `${productMainOptions.productCode}-${phoneCode}`;

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
        "Uyumlu Marka": result.phoneBrand,
        Renk: color,
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
