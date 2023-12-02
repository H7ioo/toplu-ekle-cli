import { Client } from "@notionhq/client";

import {
  CreatePageParameters,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { env } from "../lib/env";
import { Product } from "../lib/types";
import { lengthValidator } from "../lib/utils";

// TODO: Client duplicate!

type DatabaseStructure = Record<
  keyof Product,
  CreatePageParameters["properties"][string]
>;

const databaseStructure = ({
  id,
  productTitle,
  productCode,
  productDescription,
  price,
  stockAmount,
}: Product): DatabaseStructure => {
  return {
    id: {
      type: "title",
      title: [
        {
          type: "text",
          text: {
            content: id,
          },
        },
      ],
    },
    productDescription: {
      type: "rich_text",
      rich_text: [{ type: "text", text: { content: productDescription } }],
    },
    productTitle: {
      type: "rich_text",
      rich_text: [{ type: "text", text: { content: productTitle } }],
    },
    price: {
      type: "number",
      number: price,
    },
    stockAmount: {
      type: "number",
      number: stockAmount,
    },
    productCode: {
      type: "rich_text",
      rich_text: [{ type: "text", text: { content: productCode } }],
    },
  };
};

export async function notionCreateProduct(props: Product) {
  const client = new Client({
    auth: env.NOTION_SECRET,
  });

  const product = await client.pages.create({
    parent: {
      database_id: env.NOTION_DATABASE,
    },
    properties: {
      ...(databaseStructure(props) as CreatePageParameters["properties"]),
    },
  });

  return product;
}

export async function notionCheckProduct(productCode: string) {
  const client = new Client({ auth: env.NOTION_SECRET });
  const product = await client.databases.query({
    database_id: env.NOTION_DATABASE,
    filter: {
      property: "productCode",
      rich_text: { equals: productCode },
    },
  });

  return { product: product, doesExist: lengthValidator(product.results) };
}

export async function notionGetProducts({
  size = 100,
  nextCursor = null,
}: {
  size?: number;
  nextCursor?: null | string;
}) {
  const client = new Client({ auth: env.NOTION_SECRET });

  const products = await client.databases.query({
    database_id: env.NOTION_DATABASE,
    start_cursor: nextCursor === null ? undefined : nextCursor,
    page_size: size,

    sorts: [{ direction: "descending", timestamp: "last_edited_time" }],
  });

  // TODO: Better implementation
  type rich_text = {
    type: "rich_text";
    rich_text: Array<RichTextItemResponse>;
    id: string;
  };

  type title = {
    type: "title";
    title: Array<RichTextItemResponse>;
    id: string;
  };

  type created_time = {
    type: "created_time";
    created_time: string;
    id: string;
  };

  type num = {
    type: "number";
    number: number | null;
    id: string;
  };

  const formattedProducts: Product[] = [];

  for (const product of products.results) {
    if (product.object === "page" && "properties" in product) {
      const productProps = product.properties as unknown as {
        productTitle: rich_text;
        productCode: rich_text;
        stockAmount: num;
        productDescription: rich_text;
        price: num;
        createdTime: created_time;
        id: title;
      };

      formattedProducts.push({
        id: productProps.id.title[0]!.plain_text,
        productTitle: productProps.productTitle.rich_text[0]!.plain_text,
        productCode: productProps.productCode.rich_text[0]!.plain_text,
        productDescription:
          productProps.productDescription.rich_text[0]!.plain_text,
        price: productProps.price.number!,
        stockAmount: productProps.stockAmount.number!,
      });
    }
  }

  return {
    result: products,
    products: formattedProducts,
    hasMore: products.has_more,
    nextCursor: products.next_cursor,
  };
}
