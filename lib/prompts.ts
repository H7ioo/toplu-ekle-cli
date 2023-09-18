import { QuestionCollection, prompt } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  lengthValidator,
  numberPromptConfig,
} from "../lib/utils";
import { ProductMainOptions, ProductMainOptionsScheme } from "../lib/types";

export async function productMainPrompt() {
  const mainCollection: QuestionCollection<ProductMainOptions> = [
    {
      type: "input",
      name: "productTitle",
      message: "Ürün adı yazınız",
      filter: (input: string) => {
        return capitalizeLetters(cleanUp(input));
      },
      validate: (input) => lengthValidator(input, true),
      suffix: ":",
    },
    {
      type: "input",
      name: "productCode",
      message: "Ana model kodu yazınız",
      filter: (input: string) => {
        return cleanUp(input).toUpperCase();
      },
      validate: async (input) => lengthValidator(input, true),
      suffix: ":",
    },
    {
      name: "price",
      message: "Satış fiyatı yazınız (.)",
      ...numberPromptConfig(true),
      suffix: ":",
    },
    {
      name: "stockAmount",
      message: "Stock adedi yazınız",
      ...numberPromptConfig(true),
      suffix: ":",
    },
    {
      type: "input",
      name: "productDescription",
      message: "Ürün açıklaması yazınız",
      validate: (input) => lengthValidator(input, true),
      suffix: ":",
    },
  ];

  const result = await prompt(mainCollection);

  ProductMainOptionsScheme.parse(result);

  return result;
}
