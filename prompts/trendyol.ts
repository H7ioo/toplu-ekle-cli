import { QuestionCollection, prompt } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  generateGTIN,
  lengthValidator,
  numberPromptConfig,
  removePhoneBrandRegEx,
  removeWhiteSpaces,
  replaceEmptyOptionWithString,
  replaceTurkishI,
} from "../lib/utils";
import { ProdcutCategories, ProductMainOptions } from "../types/global";
import {
  HeadphoneCaseOptions,
  HeadphoneCaseOptionsScheme,
  HeadphoneFieldsOptions,
  HeadphoneFieldsScheme,
  PhoneCaseFields,
  PhoneCaseFieldsScheme,
  PhoneCaseOptions,
  PhoneCaseOptionsScheme,
  TrendyolMainOptions,
  TrendyolMainOptionsScheme,
} from "../types/trendyol";
import { KDV } from "../variables/global";
import {
  trendyolCaseMaterials_PhoneCase,
  trendyolCaseTypes_PhoneCase,
  trendyolGuaranteePeriods_HeadphoneCase,
  trendyolGuaranteePeriods_PhoneCase,
  trendyolHeadPhoneBrands_HeadphoneCase,
  trendyolHeadphonesList_HeadphoneCase,
  trendyolPhoneBrands_PhoneCase,
  trendyolPhonesList_PhoneCase,
  trendyolPhonesListExtend_PhoneCase,
  trendyolShipmentType,
} from "../variables/trendyol";

const suffix = " (trendyol):";

export const TrendyolPromptsWrapper: Record<
  ProdcutCategories[number],
  (
    productMainOptions: ProductMainOptions,
    companyMainOptions: TrendyolMainOptions
  ) => ReturnType<
    | typeof phoneCase
    | typeof charm
    | typeof cableProtectorSet
    | typeof strap
    | typeof headphoneCase
  >
> = {
  kılıf: phoneCase,
  "kablo koruyucu seti": cableProtectorSet,
  "kulaklık kılıf": headphoneCase,
  charm: charm,
  kordon: strap,
};

export async function TrendyolMainPrompts() {
  const trendyolMainPrompts: QuestionCollection<TrendyolMainOptions> = [
    {
      type: "input",
      name: "trademark",
      message: "Marka adı yazınız",
      validate: (input: string) => lengthValidator(input, true),
      suffix,
    },
    {
      name: "marketPrice",
      message: "Piyasa fiyatı yazınız",
      suffix,
      ...numberPromptConfig(true),
    },
    {
      name: "shipmentTime",
      message: "Sevkiyat süresi yazınız",
      suffix,
      ...numberPromptConfig(false),
    },
    {
      type: "search-list",
      name: "shipmentType",
      message: "Sevkiyat türü seçiniz",
      choices: trendyolShipmentType,
      suffix,
    },
  ];
  const result = await prompt<TrendyolMainOptions>(trendyolMainPrompts);

  TrendyolMainOptionsScheme.parse(result);

  return { ...result };
}

async function phoneCase(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {
  const CATEGORY_ID = 766;

  const promptQuestions: QuestionCollection<PhoneCaseOptions> = [
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
      suffix,
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
      suffix,
    },
    {
      type: "search-checkbox",
      name: "phonesList",
      message: `Telefon modelleri seçiniz`,
      choices: [
        ...trendyolPhonesList_PhoneCase,
        ...trendyolPhonesListExtend_PhoneCase,
      ],
      suffix,
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
      suffix,
    },
    {
      type: "search-list",
      name: "caseMaterial",
      message: "Materyal seçiniz",
      choices: trendyolCaseMaterials_PhoneCase,
      suffix,
    },
    {
      type: "search-list",
      name: "caseType",
      message: "Kılıf modeli seçiniz",
      choices: trendyolCaseTypes_PhoneCase,
      suffix,
    },
    {
      type: "search-list",
      name: "guranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: trendyolGuaranteePeriods_PhoneCase,
      suffix,
    },
    {
      type: "search-list",
      name: "phoneBrand",
      message: "Uyumlu marka seçiniz",
      choices: trendyolPhoneBrands_PhoneCase,
      suffix,
    },
  ];
  const result = await prompt<PhoneCaseOptions>(promptQuestions);

  PhoneCaseOptionsScheme.parse(result);

  // Regex made to remove Samsung from "Samsung Galaxy A12"
  const regex = removePhoneBrandRegEx(result.productKnownBrandName);

  const products: PhoneCaseFields[] = [];

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
      ] as (typeof trendyolPhonesList_PhoneCase)[number];
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

      const fields: PhoneCaseFields = {
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
        "Cep Telefonu Modeli": trendyolPhonesList_PhoneCase.includes(phone)
          ? phone
          : "",
        "Garanti Tipi": result.guranteeType ?? "",
        "Garanti Süresi": result.guranteePeriod ?? "",
        "Uyumlu Marka": result.phoneBrand ?? "",
      };

      PhoneCaseFieldsScheme.parse(fields);

      products.push(fields);
    }
  }

  return { products };
}

async function headphoneCase(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {
  const CATEGORY_ID = 3494;

  const promptQuestions: QuestionCollection<HeadphoneCaseOptions> = [
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
      suffix,
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
      suffix,
    },
    {
      type: "search-checkbox",
      name: "headPhonesList",
      message: `Kulaklık modelleri seçiniz`,
      choices: trendyolHeadphonesList_HeadphoneCase,
      suffix,
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
      suffix,
    },
    {
      type: "search-list",
      name: "guranteePeriod",
      message: "Garanti süresi seçiniz",
      choices: trendyolGuaranteePeriods_HeadphoneCase,
      suffix,
    },
    {
      type: "search-list",
      name: "headPhoneBrand",
      message: "Uyumlu marka seçiniz",
      choices: trendyolHeadPhoneBrands_HeadphoneCase,
      suffix,
    },
  ];
  const result = await prompt<HeadphoneCaseOptions>(promptQuestions);

  HeadphoneCaseOptionsScheme.parse(result);

  // Regex made to remove Samsung from "Samsung Galaxy A12"
  const regex = removePhoneBrandRegEx(result.productKnownBrandName);

  const products: HeadphoneFieldsOptions[] = [];

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
      ][p] as (typeof trendyolPhonesList_PhoneCase)[number];
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

      const fields: HeadphoneFieldsOptions = {
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
        "Garanti Süresi": result.guranteePeriod ?? "",
        "Uyumlu Marka": result.headPhoneBrand ?? "",
        "Uyumlu Model": trendyolPhonesList_PhoneCase.includes(headPhone)
          ? headPhone
          : "",
      };

      HeadphoneFieldsScheme.parse(fields);

      products.push(fields);
    }
  }

  return { products };
}

async function charm(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {}
async function cableProtectorSet(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {}
async function strap(
  productMainOptions: ProductMainOptions,
  companyMainOptions: TrendyolMainOptions
) {}

// TODO: Main fields gets a function so I don't duplicate
