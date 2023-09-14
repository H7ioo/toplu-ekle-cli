import * as XLSX from "xlsx";

import { Question } from "inquirer";
import { EMPTY_OPTION } from "../variables/global";

/**
 * It validates the string or the array. It checks if the length is bigger than zero. Since split returns [''], we need to check multiple times for the Array
 * @param text The text.
 * @returns true if the string is longer than zero
 */
export function lengthValidator<T extends string | T[]>(
  text: T | T[] | [],
  errorMessage = false
) {
  if (Array.isArray(text)) {
    const arrayLength = text.length > 0;
    // [{}][0].length => undefined so we need to check for it.
    if (typeof text[0] === "string") {
      return arrayLength && text[0].length > 0
        ? true
        : errorMessage
        ? "Alan boş bırakılmamalı!"
        : false;
    } else {
      return arrayLength
        ? true
        : errorMessage
        ? "Alan boş bırakılmamalı!"
        : false;
    }
  }
  if (text.trim().length <= 0)
    return errorMessage ? "Alan boş bırakılmamalı!" : false;
  return true;
}

/**
 * Trims extra whitespace, split it and uppercase first letter then it joins to create a string.
 *
 * @param text The text.
 * @returns Capitalized text.
 */
export function capitalizeLetters(text: string) {
  return text
    .toLowerCase()
    .trim()
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

/**
 * Trims extra whitespace and lowercases the text. Replaces , at the start and the end
 * @param text The text.
 * @param lowerCase Option to lowerCase the text. Defaults to true.
 * @returns Cleared up text.
 * @example cleanUp("   Text HERE ")
 */

export function cleanUp(text: string, lowerCase = true) {
  const res = text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(^,)|(,$)/g, "");
  return lowerCase ? res.toLowerCase() : res;
}

/**
 * Converts string to a number
 * @param value string which will get converted to a number
 * @param float I want number with float
 * @returns a number
 */
export function convertToNumber(value: string, float = true) {
  const v = value.replace(/,/gi, ".");
  if (float) return parseFloat(v);
  return parseInt(v);
}

/**
 * It checks if the passed value is a number
 * @param value the value which might be a string or a number.
 * @param errorMessage the default is true. When set to true it returns an error message instead of boolean value
 * @returns If the value is a number return true.
 */
export function numberValidator(value: string | number, errorMessage = true) {
  if (typeof value === "string") {
    const validator = !isNaN(parseFloat(value)) && lengthValidator(value);
    if (errorMessage) return validator ? true : "Sadece sayılar yazılmalı!";
    return validator;
  } else {
    return true;
  }
}

export function numberPromptConfig(required: boolean) {
  const object: {
    type: "number";
    filter: Question["filter"];
    validate: Question["validate"];
  } = {
    type: "number",
    filter: (input) => {
      if (isNaN(input)) return undefined;
      return input;
    },
    validate: (input) => {
      if (required && input === undefined)
        return "Bu alan rakamlardan oluşmalı ve boş bırakılmamlı.";
      if (input === undefined) return true;
      return true;
    },
  };
  return object;
}

/**
 * Regex to remove phoneBrand
 * @param phoneBrand Name of the phone brand
 * @returns
 */
export const removePhoneBrandRegEx = (phoneBrand: string) => {
  return new RegExp(replaceTurkishI(phoneBrand).toLowerCase(), "gi");
};

/**
 * Replaces Turkish weird I letter with English I letter
 * @param text
 * @returns a text without Turkish letters
 */
export function replaceTurkishI(text: string) {
  return text.replace(/i̇/gi, "i").replace(/İ/gi, "I");
}

/**
 * Removes all whitespace.
 *
 * @param text The text.
 * @returns Text without any whitespace.
 */
export function removeWhiteSpaces(text: string) {
  return text.replace(/\s/g, "");
}

export function replaceEmptyOptionWithString<T>(value: T) {
  return value === EMPTY_OPTION ? "" : value;
}

export function generateGTIN() {
  const length = 8;
  let gtin = "";
  for (let i = 0; i < length - 1; i++) {
    gtin += Math.floor(Math.random() * 10).toString();
  }

  // Calculate the check digit (last digit) based on the GTIN formula
  const digits = gtin.split("").map(Number);
  const sum = digits.reduce((acc, digit, index) => {
    if (index % 2 === 0) {
      return acc + digit * 3;
    } else {
      return acc + digit;
    }
  }, 0);

  const checkDigit = (10 - (sum % 10)) % 10;
  gtin += checkDigit.toString();

  return gtin;
}

// TODO: Fuck excel. Find a way to append to existing workbook

export function writeToExcel(
  resultArray: object[],
  path: string,
  mainModalCode: string,
  caseBrand: string,
  company: "trendyol" | "hepsiburada"
) {
  // Sheet name depending on company
  let sheetName;
  switch (company) {
    case "hepsiburada":
      sheetName = "Kılıflar";
      break;
    case "trendyol":
      sheetName = "Ürünlerinizi Burada Listeleyin";
      break;
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(resultArray);

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(
    workbook,
    `${path}\\${caseBrand}-${mainModalCode}-${company}.xlsx`
  );
}
