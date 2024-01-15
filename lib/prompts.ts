import { QuestionCollection, prompt } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  lengthValidator,
  numberPromptConfig,
  returnDataFile,
} from "../lib/utils";
import {
  Product,
  ProductMainOptions,
  ProductMainOptionsScheme,
} from "../lib/types";
import { notionCheckProduct } from "../scripts/notion";

export async function productMainPrompt(productMainOptionsParam?: Product) {
  const productMainOptionsExists = !!productMainOptionsParam;
  let productExists = false;

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
      when: !productMainOptionsExists,
    },
    {
      type: "input",
      name: "productCode",
      message: "Ana model kodu yazınız",
      filter: (input: string) => {
        return cleanUp(input).toUpperCase();
      },
      validate: async (input) => {
        const project = returnDataFile("project");

        breakMe: if (project.database === "JSON") {
          const products = returnDataFile("products");
          if (!products.length) break breakMe;
          const doesExist = products.find((p) => p.productCode === input);
          if (!doesExist) break breakMe;
          if (productExists) return lengthValidator(input, true);
          productExists = true;
          return "This product is already in the database! Press enter again to continue.";
        } else if (project.database === "Notion") {
          const { doesExist } = await notionCheckProduct(input);
          if (!doesExist) break breakMe;
          if (productExists) return lengthValidator(input, true);
          productExists = true;
          return "This product is already in the database! Press enter again to continue.";
        }

        return lengthValidator(input, true);
      },
      suffix: ":",
      when: !productMainOptionsExists,
    },
    {
      name: "price",
      message: "Satış fiyatı yazınız (.)",
      ...numberPromptConfig(true),
      suffix: ":",
      default: productMainOptionsExists
        ? productMainOptionsParam?.price
        : undefined,
    },
    {
      name: "stockAmount",
      message: "Stock adedi yazınız",
      ...numberPromptConfig(true),
      suffix: ":",
      when: !productMainOptionsExists,
    },
    {
      type: "input",
      name: "productDescription",
      message: "Ürün açıklaması yazınız",
      validate: (input) => lengthValidator(input, true),
      suffix: ":",
      when: !productMainOptionsExists,
    },
  ];

  const result = {
    ...productMainOptionsParam,
    ...(await prompt(mainCollection)),
  };

  ProductMainOptionsScheme.parse(result);

  return {
    productMainOptions: result,
    productExists: productMainOptionsExists,
  };
}
