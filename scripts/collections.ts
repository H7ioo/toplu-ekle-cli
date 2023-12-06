import { input, select } from "@inquirer/prompts";
import { ProductCategories } from "../lib/types";
import {
  createCollection,
  deleteCollection,
  editCollection,
  lengthValidator,
  registerPrompts,
  returnDataFile,
} from "../lib/utils";
import { companies, productCategories } from "../lib/variables";
import { mainPrompt } from "../main";

(async () => {
  registerPrompts();

  const transaction = await select({
    choices: [
      { value: "create", name: "Oluştur" },
      { value: "createInAll", name: "Hepsinde Oluştur" },
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

    await createCollection({ company, category });
  } else if (transaction === "edit") {
    await editCollection();
  } else if (transaction === "delete") {
    await deleteCollection();
  } else if (transaction === "createInAll") {
    // Wow! Sucks too much
    const { selectedCompanies, productCategory: category } = await mainPrompt();

    const collectionData = returnDataFile("collections");

    const defaultCollectionName = await input({
      message: "Koleksiyon adı yazınız",
      validate(collectionName) {
        if (collectionData) {
          for (const company of selectedCompanies) {
            const collectionNameExists = !collectionData?.find(
              (c) =>
                c.category === category &&
                c.company === company &&
                c.collectionName.toLowerCase() === collectionName.toLowerCase()
            );
            return collectionNameExists
              ? true
              : `Koleksiyon adı ${company} şirketinde kullanılmış!`;
          }
          return true;
        } else {
          return lengthValidator(collectionName, true);
        }
      },
    });

    for await (const company of selectedCompanies) {
      await createCollection({ company, category, defaultCollectionName });
    }
  }
})();
