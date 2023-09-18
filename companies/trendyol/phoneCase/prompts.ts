import { QuestionCollection, prompt } from "inquirer";
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
import { ProductMainOptions } from "../../../lib/types";
import { TRENDYOL_SUFFIX } from "../variables";
import { TrendyolMainOptions } from "../types";
import { KDV, sheetNames } from "../../../lib/variables";
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
  PhoneCase_PhonesListExtend,
  PhoneCase_PhonesList,
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
      choices: [...PhoneCase_PhonesList, ...PhoneCase_PhonesListExtend],
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
      name: "guranteePeriod",
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
      ] as (typeof PhoneCase_PhonesList)[number];
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
        Barkod: barcode,
        "Model Kodu": productModalCode,
        Marka: companyMainOptions.trademark ?? "",
        Kategori: CATEGORY_ID,
        "Para Birimi": "TRY",
        "Ürün Adı": productTitle,
        "Ürün Açıklaması": productMainOptions.productDescription,
        "Piyasa Satış Fiyatı (KDV Dahil)": companyMainOptions.marketPrice,
        "Trendyol'da Satılacak Fiyat (KDV Dahil)": productMainOptions.price,
        "Ürün Stok Adedi": productMainOptions.stockAmount,
        "Stok Kodu": productMainOptions.productCode,
        "KDV Oranı": KDV["3"],
        Desi: "",
        "Görsel 1": "",
        "Görsel 2": "",
        "Görsel 3": "",
        "Görsel 4": "",
        "Görsel 5": "",
        "Görsel 6": "",
        "Görsel 7": "",
        "Görsel 8": "",
        "Sevkiyat Süresi": companyMainOptions.shipmentTime ?? "",
        "Sevkiyat Tipi": companyMainOptions.shipmentType ?? "",
        Renk: color,
        Materyal: replaceEmptyOptionWithString(result.caseMaterial) ?? "",
        Model: replaceEmptyOptionWithString(result.caseType) ?? "",
        "Cep Telefonu Modeli": PhoneCase_PhonesList.includes(phone)
          ? phone
          : "",
        "Garanti Tipi": result.guranteeType ?? "",
        "Garanti Süresi": result.guranteePeriod ?? "",
        "Uyumlu Marka": result.phoneBrand ?? "",
      };

      FIELDS_SCHEME.parse(fields);

      products.push(fields);
    }
  }

  return { products, category: CATEGORY_NAME };
}
