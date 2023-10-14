import { QuestionCollection, prompt } from "inquirer";
import { ProdcutCategories, ProductMainOptions } from "../../lib/types";
import {
  lengthValidator,
  numberPromptConfig,
  replaceEmptyOptionWithString,
} from "../../lib/utils";
import { KDV } from "../../lib/variables";
import { cableProtector } from "./cableProtector/prompts";
import { headphoneCase } from "./headphoneCase/prompts";
import { phoneCase } from "./phoneCase/prompts";
import { screenProtector } from "./screenProtector/prompts";
import {
  TrendyolMainOptions,
  TrendyolMainOptionsFields,
  TrendyolMainOptionsScheme,
} from "./types";
import { ShipmentTypes, TRENDYOL_SUFFIX } from "./variables";
import { watchBand } from "./watchBand/prompts";
import { watchCharm } from "./watchCharm/prompts";
import { lensProtector } from "./lensProtector/prompts";
import { caseStand } from "./caseStand/prompts";

export const TrendyolPromptsWrapper: Record<
  keyof ProdcutCategories["trendyol"],
  (
    productMainOptions: ProductMainOptions,
    companyMainOptions: TrendyolMainOptions
  ) => ReturnType<
    | typeof phoneCase
    | typeof headphoneCase
    | typeof watchBand
    | typeof watchCharm
    | typeof cableProtector
    | typeof screenProtector
    | typeof lensProtector
    | typeof caseStand
  >
> = {
  phoneCase,
  headphoneCase,
  watchBand,
  watchCharm,
  cableProtector,
  screenProtector,
  lensProtector,
  caseStand,
};

export async function TrendyolMainPrompts() {
  const trendyolMainPrompts: QuestionCollection<TrendyolMainOptions> = [
    {
      type: "input",
      name: "trademark",
      message: "Marka adı yazınız",
      validate: (input: string) => lengthValidator(input, true),
      suffix: TRENDYOL_SUFFIX,
    },
    {
      name: "marketPrice",
      message: "Piyasa fiyatı yazınız",
      suffix: TRENDYOL_SUFFIX,
      ...numberPromptConfig(true),
    },
    {
      name: "shipmentTime",
      message: "Sevkiyat süresi yazınız",
      suffix: TRENDYOL_SUFFIX,
      ...numberPromptConfig(false),
    },
    {
      type: "search-list",
      name: "shipmentType",
      message: "Sevkiyat türü seçiniz",
      choices: ShipmentTypes,
      suffix: TRENDYOL_SUFFIX,
    },
  ];
  const result = await prompt<TrendyolMainOptions>(trendyolMainPrompts);

  TrendyolMainOptionsScheme.parse(result);

  return { ...result };
}

export function TrendyolMainFields<CATEGORY_ID extends number = number>({
  barcode,
  productModalCode,
  trademark,
  CATEGORY_ID,
  marketPrice,
  price,
  productDescription,
  productTitle,
  stockAmount,
  productCode,
  shipmentTime,
  shipmentType,
}: {
  barcode: string;
  productModalCode: string;
  trademark: string;
  CATEGORY_ID: CATEGORY_ID;
  productTitle: string;
  productDescription: string;
  price: number;
  marketPrice: number;
  stockAmount: number;
  productCode: string;
  shipmentTime: number | undefined;
  shipmentType: (typeof ShipmentTypes)[number];
}) {
  const object: TrendyolMainOptionsFields & { Kategori: CATEGORY_ID } = {
    Barkod: barcode,
    "Model Kodu": productModalCode,
    Marka: trademark,
    Kategori: CATEGORY_ID,
    "Para Birimi": "TRY",
    "Ürün Adı": productTitle,
    "Ürün Açıklaması": productDescription,
    "Piyasa Satış Fiyatı (KDV Dahil)": marketPrice,
    "Trendyol'da Satılacak Fiyat (KDV Dahil)": price,
    "Ürün Stok Adedi": stockAmount,
    "Stok Kodu": productCode,
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
    "Sevkiyat Süresi": replaceEmptyOptionWithString(shipmentTime) ?? "",
    "Sevkiyat Tipi": replaceEmptyOptionWithString(shipmentType) ?? "",
  } as const;
  return object;
}
