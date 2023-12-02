import { prompt } from "inquirer";
import { registerPrompts, returnDataFile } from "./lib/utils";
import { notionGetProducts } from "./scripts/notion";

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

        message: "Test",
      },
    ]).then((p) => p.product);

    // pass to main
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

      // pass to main
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Check the length, and return based on it.
  // If length, copy the data and pass it to main(duplicate, mainPrompts, shouldAskAgain...)
}

copy();
