import { prompt, registerPrompt } from "inquirer";
import { lengthValidator, writeToExcel } from "./lib/utils";
import {
  TrendyolMainPrompts,
  TrendyolPromptsWrapper,
} from "./prompts/trendyol";
import { ArrayOfLiterals, Companies, ProdcutCategories } from "./types/global";
import { companies, prodcutCategories } from "./variables/global";
import { productMainPrompt } from "./prompts/global";

// TODO: Validate function required if the generic is required
// TODO: Filter function return is not wroking
// -----

// eslint-disable-next-line @typescript-eslint/no-var-requires
registerPrompt("search-list", require("inquirer-search-list"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
registerPrompt("search-checkbox", require("inquirer-search-checkbox"));

(async () => {
  const { companies: selectedCompanies, prodcutCategory } = await prompt<{
    companies: ArrayOfLiterals<Companies>;
    prodcutCategory: ProdcutCategories[number];
  }>([
    {
      name: "companies",
      type: "search-checkbox",
      choices: companies,
      message: "Şirket seçiniz",
      validate: (input: string[]) => lengthValidator(input),
      suffix: ":",
    },
    {
      type: "search-list",
      name: "prodcutCategory",
      message: "Ürün kategoresi seçiniz",
      choices: prodcutCategories,
      validate: (input: string[]) => lengthValidator(input),
      suffix: ":",
    },
  ]);

  const productMainOptions = await productMainPrompt();

  // if (selectedCompanies.includes("hepsiburada")) {
  //   TrendyolPromptsWrapper[prodcutCategory]();
  // }
  if (selectedCompanies.includes("trendyol")) {
    const companyMainOptions = await TrendyolMainPrompts();
    const result = await TrendyolPromptsWrapper[prodcutCategory](
      productMainOptions,
      companyMainOptions
    );
    if (result && result?.products) {
      // Write to excel
      writeToExcel(
        result.products,
        "c:\\users\\omarj\\downloads",
        productMainOptions.productCode,
        result.products[0]?.["Uyumlu Marka"] ?? "",
        "trendyol"
      );
    } else {
      console.error("Products doesn't exist on result.");
    }
  }
})();

// {
//   name: "test",
//   type: "number",
//   filter: (input: number) => {
//     if (isNaN(input)) return undefined;
//     return input;
//   },
//   validate: (input: number) => {
//     if (input === undefined) return "Required Or Not Here!";
//     return true;
//   },
// },
