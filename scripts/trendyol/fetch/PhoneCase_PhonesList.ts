import axios from "axios";
import { writeFileSync } from "fs";
import { TrendyolCategoryAttr } from "../../../companies/trendyol/APITypes";
import { CATEGORY_ID } from "../../../companies/trendyol/phoneCase/prompts";
import { env } from "../../../lib/env";
import { logger } from "../../../lib/logger";
import { generateAuthToken, phoneModelsSort } from "../../../lib/utils";

export const PhoneCase_PhonesList_Writer = async () => {
  const array = await PhoneCase_PhonesList_Getter();

  writeFileSync(
    "./data/trendyol/PhoneCase_PhonesList.json",
    JSON.stringify(array)
  );
};

export const PhoneCase_PhonesList_Getter = async () => {
  if (
    !env.TRENDYOL_USERNAME ||
    !env.TRENDYOL_PASSWORD ||
    !env.TRENDYOL_USER_AGENT
  ) {
    logger.error("TRENDYOL BILGILERI BULUNAMADI!");
    throw new Error("TRENDYOL BILGILERI BULUNAMADI!");
  }

  try {
    const res = await axios.get<TrendyolCategoryAttr>(
      `https://api.trendyol.com/sapigw/product-categories/${CATEGORY_ID}/attributes`,
      {
        headers: {
          "User-Agent": env.TRENDYOL_USER_AGENT,
          Authorization: generateAuthToken(
            env.TRENDYOL_USERNAME,
            env.TRENDYOL_PASSWORD
          ),
        },
      }
    );

    const filtered = res.data.categoryAttributes
      ?.filter((attr) => attr.attribute.name === "Cep Telefonu Modeli")[0]
      ?.attributeValues?.map((ob) => ob?.name);

    const sorted = filtered?.sort(phoneModelsSort);

    if (!sorted || !sorted?.length)
      throw new Error("TRENDYOL'DAN BEKLENMEYEN BIR HATA OLUŞTU!");

    return sorted;
  } catch (error) {
    logger.error("Error occurred while fetching category attributes", error);
    throw new Error("Error occurred while fetching category attributes");
  }
};

(async () => {
  await PhoneCase_PhonesList_Writer();
})();
