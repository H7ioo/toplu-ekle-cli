import { KDV } from "../../lib/variables";
import {
  HepsiburadaMainOptions,
  HepsiburadaMainOptionsFields,
  HepsiburadaMainOptionsScheme,
} from "./types";

import { QuestionCollection, prompt } from "inquirer";
import { ProdcutCategories, ProductMainOptions } from "../../lib/types";
import { lengthValidator, numberPromptConfig } from "../../lib/utils";
import { HEPSIBURADA_SUFFIX } from "./variables";
import { phoneCase } from "./phoneCase/prompts";
import { headphoneCase } from "./headphoneCase/prompts";
import { watchBand } from "./watchBand/prompts";
import { caseStand } from "./caseStand/prompts";
//
export const HepsiburadaPromptsWrapper: Record<
  keyof ProdcutCategories["hepsiburada"],
  (
    productMainOptions: ProductMainOptions,
    companyMainOptions: HepsiburadaMainOptions
  ) => ReturnType<
    | typeof phoneCase
    | typeof headphoneCase
    | typeof watchBand
    | typeof caseStand
    // | typeof watchCharm
    // | typeof cableProtector
    // | typeof screenProtector
    // | typeof lensProtector
  >
> = {
  phoneCase,
  headphoneCase,
  watchBand,
  caseStand,
  // watchCharm,
  // cableProtector,
  // screenProtector,
  // lensProtector,
};

export async function HepsiburadaMainPrompts() {
  const HepsiburadaMainPrompts: QuestionCollection<HepsiburadaMainOptions> = [
    {
      type: "input",
      name: "trademark",
      message: "Marka adı yazınız",
      validate: (input: string) => lengthValidator(input, true),
      suffix: HEPSIBURADA_SUFFIX,
    },
    {
      name: "guaranteePeriod",
      message: "Garanti süresi (ay) yazınız",
      suffix: HEPSIBURADA_SUFFIX,
      ...numberPromptConfig(true),
    },
    {
      type: "input",
      name: "productVideo",
      message: "Video linki yazınız",
      suffix: HEPSIBURADA_SUFFIX,
    },
  ];
  const result = await prompt<HepsiburadaMainOptions>(HepsiburadaMainPrompts);

  HepsiburadaMainOptionsScheme.parse(result);

  return { ...result };
}

export function HepsiburadaMainFields({
  barcode,
  productModalCode,
  trademark,
  price,
  productDescription,
  productTitle,
  stockAmount,
  productCode,
  guaranteePeriod,
  productVideo,
}: {
  barcode: string;
  productModalCode: string;
  trademark: string;
  productTitle: string;
  productDescription: string;
  price: number;
  stockAmount: number;
  productCode: string;
  guaranteePeriod: number;
  productVideo: string | undefined;
}) {
  const object: HepsiburadaMainOptionsFields = {
    "Ürün Adı": productTitle,
    "Satıcı Stok Kodu": productCode,
    Barkod: barcode,
    "Varyant Grup Id": productModalCode,
    "Ürün Açıklaması": productDescription,
    Marka: trademark,
    Desi: 0,
    KDV: KDV[3],
    "Garanti Süresi (Ay)": guaranteePeriod,
    Görsel1: "",
    Görsel2: "",
    Görsel3: "",
    Görsel4: "",
    Görsel5: "",
    Fiyat: price.toString().replace(/\./gi, ","),
    Stok: stockAmount,
    Video: productVideo ?? "",
  } as const;
  return object;
}
