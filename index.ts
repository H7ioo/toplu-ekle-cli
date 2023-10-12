import { prompt } from "inquirer";
import {
  TrendyolMainPrompts,
  TrendyolPromptsWrapper,
} from "./companies/trendyol/prompts";
import { productMainPrompt } from "./lib/prompts";
import { ArrayOfLiterals, Companies, ProdcutCategories } from "./lib/types";
import {
  configPrompt,
  lengthValidator,
  registerPrompts,
  writeToExcel,
} from "./lib/utils";
import { companies, prodcutCategories } from "./lib/variables";
import {
  HepsiburadaMainPrompts,
  HepsiburadaPromptsWrapper,
} from "./companies/hepsiburada/prompts";

registerPrompts();

(async () => {
  const { companies: selectedCompanies, prodcutCategory } = await prompt<{
    companies: ArrayOfLiterals<Companies>;
    prodcutCategory: keyof ProdcutCategories[Companies[number]];
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
      choices: (answers) => {
        // 1 Company
        if (answers.companies.length <= 1) {
          const company = answers.companies[0];
          if (company) return Object.values(prodcutCategories[company]);
        }
        // 2 or more companies
        if (answers.companies.length > 1) {
          const categories = answers.companies
            .map((company) => Object.values(prodcutCategories[company]))
            .flat();
          return categories.filter(
            (item, index) => categories.indexOf(item) === index
          );
        }
        throw new Error("Company doesn't exists!");
      },
      filter: (
        input: ProdcutCategories[Companies[number]][keyof ProdcutCategories[Companies[number]]],
        answers
      ) => {
        // If 1 company exists it will get it. If there are more than one that means that the choices will get narrowed. So, typing only the first company of the array will do it.
        const company = answers.companies[0];
        if (company)
          // Gets the key from the value
          return Object.keys(prodcutCategories[company]).find((_key) => {
            const key = _key as keyof ProdcutCategories[Companies[number]];
            return prodcutCategories[company][key] === input;
          }) as keyof ProdcutCategories[Companies[number]];
        throw new Error("Company doesn't exists!");
      },

      validate: (input: string[]) => {
        return lengthValidator(input);
      },
      suffix: ":",
    },
  ]);

  const productMainOptions = await productMainPrompt();

  const configData = await configPrompt();

  if (selectedCompanies.includes("trendyol")) {
    const companyMainOptions = await TrendyolMainPrompts();
    const result = await TrendyolPromptsWrapper[prodcutCategory](
      productMainOptions,
      companyMainOptions
    );

    if (!result.products[0]) throw new Error("Prodcuts array is empty!");

    let brand: string;
    if ("Uyumlu Marka" in result.products[0]) {
      brand = result.products[0]?.["Uyumlu Marka"];
    } else if ("productKnownBrandName" in result) {
      brand = result.productKnownBrandName;
    } else {
      brand = "UNKNOWN";
    }

    await writeToExcel({
      company: "trendyol",
      category: result.category,
      caseBrand: brand,
      trademark: result.products[0]?.Marka ?? "",
      outPath: configData.path,
      data: result.products,
      mainModalCode: productMainOptions.productCode,
    });
  }
  if (selectedCompanies.includes("hepsiburada")) {
    const companyMainOptions = await HepsiburadaMainPrompts();
    const result = await HepsiburadaPromptsWrapper[prodcutCategory](
      productMainOptions,
      companyMainOptions
    );

    if (!result.products[0]) throw new Error("Prodcuts array is empty!");

    let brand: string;
    if ("Uyumlu Marka" in result.products[0]) {
      brand = result.products[0]?.["Uyumlu Marka"];
    } else if ("productKnownBrandName" in result) {
      brand = result.productKnownBrandName;
    } else {
      brand = "UNKNOWN";
    }

    await writeToExcel({
      company: "hepsiburada",
      category: result.category,
      caseBrand: brand,
      trademark: result.products[0]?.Marka ?? "",
      outPath: configData.path,
      data: result.products,
      mainModalCode: productMainOptions.productCode,
    });
  }
})();
