import { EMPTY_OPTION } from "../../lib/variables";

/**
 * @Field Sevkiyat Tipi
 */
export const ShipmentTypes = [
  "Hızlı Teslimat",
  "Bugün Kargoda",
  EMPTY_OPTION,
] as const;

export const TRENDYOL_SUFFIX = " (trendyol):";

// TODO: phoneCase prompt if the min max length does'nt match the zod scheme throw validation error
