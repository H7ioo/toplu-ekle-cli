import { QuestionCollection, prompt } from "inquirer";
import { ProdcutCategories, ProductMainOptions } from "../../lib/types";
import { lengthValidator, numberPromptConfig } from "../../lib/utils";
import { headphoneCase } from "./headphoneCase/prompts";
import { phoneCase } from "./phoneCase/prompts";
import { TrendyolMainOptions, TrendyolMainOptionsScheme } from "./types";
import { TRENDYOL_SUFFIX, ShipmentTypes } from "./variables";
import { watchBand } from "./watchBand/prompts";

export const TrendyolPromptsWrapper: Record<
  keyof ProdcutCategories["trendyol"],
  (
    productMainOptions: ProductMainOptions,
    companyMainOptions: TrendyolMainOptions
  ) => ReturnType<typeof phoneCase | typeof headphoneCase | typeof watchBand>
> = {
  phoneCase,
  headphoneCase,
  watchBand,
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
