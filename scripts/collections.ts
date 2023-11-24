import { select } from "@inquirer/prompts";
import { ProductCategories } from "../lib/types";
import {
  checkAndCreateDirectoryFile,
  createCollection,
  registerPrompts,
  setDefaultCollections,
} from "../lib/utils";
import { companies, productCategories } from "../lib/variables";

/*
TODO: 
Better structure??
{
  company: "trendyol",
  category: "phoneCase",
  collectionName: "Hello dawG"
  values: ["X", "Y", "Z"]
}
Idk bout this
{
  category: "phoneCase",
  collectionName: "Hello cat"
  company: {
    trendyol: ["X", "Y", "Z"],
    hepsiburada: ["Z", "Y", "X"],
  }
}
*/

(async () => {
  checkAndCreateDirectoryFile("./data", "./data/collections.json");
  setDefaultCollections();
  registerPrompts();

  const transaction = await select({
    // TODO: Create in both hepsiburada and trendyol
    choices: [
      { value: "create", name: "Oluştur" },
      { value: "edit", name: "Düzenle" },
      { value: "delete", name: "Sil" },
    ] as const,
    message: "Işlem seçiniz...",
  });

  const company = await select({
    choices: companies.map((company) => ({ value: company })),
    message: "Select a company...",
  });

  const categories = Object.entries(productCategories[company]);

  const category = (await select({
    choices: categories.map(([k, v]) => ({ name: v, value: k })),
    message: "Kategori seçiniz",
  })) as keyof ProductCategories[typeof company];

  if (transaction === "create") {
    createCollection(company, category);
  } else if (transaction === "edit") {
    //
  } else if (transaction === "delete") {
    //
  }
})();
