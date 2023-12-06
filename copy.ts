import { prompt } from "inquirer";
import { registerPrompts, returnDataFile } from "./lib/utils";
import { notionGetProducts } from "./scripts/notion";
import { main } from "./main";
import { logger } from "./lib/logger";

registerPrompts();

export async function copy() {
  const project = returnDataFile("project");

  if (project.database === "JSON") {
    const products = returnDataFile("products");
    if (!products.length) {
      console.log("Ürün bulunmadı!");
      return;
    }

    const productId = await prompt<{ product: string }>([
      {
        name: "product",
        type: "search-list",
        choices: products.map((i) => ({
          value: i.id,
          name: `${i.productTitle} - ${i.productCode}`,
        })),
        message: "Ürün seçiniz",
        suffix: ":",
      },
    ]).then((p) => p.product);

    await main(products.find((p) => p.id === productId));
  } else if (project.database === "Notion") {
    try {
      const { products } = await notionGetProducts({});
      if (!products.length) {
        console.log("Ürün bulunmadı!");
        return;
      }

      // TODO: Pagination
      const productId = await prompt<{ product: string }>([
        {
          name: "product",
          type: "search-list",
          choices: products.map((i) => ({
            value: i.id,
            name: `${i.productTitle} - ${i.productCode}`,
          })),

          message: "Test",
        },
      ]).then((p) => p.product);

      await main(products.find((p) => p.id === productId));
    } catch (error) {
      logger.error(error);
      return;
    }
  }
}

copy();
