import { select } from "@inquirer/prompts";
import { ProductCategories } from "../lib/types";
import {
  checkAndCreateDirectoryFile,
  createCollection,
  deleteCollection,
  editCollection,
  registerPrompts,
} from "../lib/utils";
import { companies, productCategories } from "../lib/variables";

(async () => {
  checkAndCreateDirectoryFile("./data", "./data/collections.json");
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

  if (transaction === "create") {
    const company = await select({
      choices: companies.map((company) => ({ value: company })),
      message: "Select a company...",
    });

    const categories = Object.entries(productCategories[company]);

    const category = (await select({
      choices: categories.map(([k, v]) => ({ name: v, value: k })),
      message: "Kategori seçiniz",
    })) as keyof ProductCategories[typeof company];

    createCollection(company, category);
  } else if (transaction === "edit") {
    editCollection();
  } else if (transaction === "delete") {
    deleteCollection();
  }
})();
