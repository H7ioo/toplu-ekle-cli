import ExcelJS from "exceljs";

import { input } from "@inquirer/prompts";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFile,
  writeFileSync,
} from "fs";
import { Question, QuestionCollection, prompt, registerPrompt } from "inquirer";
import { homedir } from "os";
import path from "path";
import {
  PhoneCase_PhonesList as Hepsiburada_PhoneCase_PhonesList,
  PhoneCase_PhonesListExtend as Hepsiburada_PhoneCase_PhonesListExtend,
} from "../companies/hepsiburada/phoneCase/variables";
import {
  PhoneCase_PhonesList as Trendyol_PhoneCase_PhonesList,
  PhoneCase_PhonesListExtend as Trendyol_PhoneCase_PhonesListExtend,
} from "../companies/trendyol/phoneCase/variables";
import {
  CollectionFileData,
  ConfigFileData,
  ConfigOptions,
  ProductCategories,
} from "../lib/types";
import { configDefaultValues, configQuestionsObject } from "../lib/variables";
import { Companies } from "./types";
import { EMPTY_OPTION, sheetNames } from "./variables";

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
        return "Bu alan rakamlardan oluşmalı ve boş bırakılmamalı.";
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

export function generateGTIN(trademark: string) {
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

  return `${trademark}${gtin}`;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("exceljs/lib/doc/range").prototype.forEachAddress = function () {};

export async function writeToExcel<
  CompanyT extends Companies[number] = Companies[number],
  CategoryT extends keyof (typeof sheetNames)[CompanyT] = keyof (typeof sheetNames)[CompanyT]
>({
  data,
  outPath,
  category,
  mainModalCode,
  caseBrand,
  trademark,
  company,
  nanoId,
}: {
  data: object[];
  outPath: string;
  mainModalCode: string;
  caseBrand: string;
  trademark: string;
  company: CompanyT;
  category: CategoryT;
  nanoId: string;
}) {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  // Read
  const filePath = path.join(
    __dirname,
    `../companies/${company}/${String(category)}/${String(category)}.xlsx`
  );
  const productWorkbook = await workbook.xlsx.readFile(filePath);
  const sheetName = sheetNames[company][category];
  if (!sheetName) throw new Error("SheetName doesn't exist");
  const worksheet = productWorkbook.getWorksheet(sheetName);

  // For Trendyol
  if (company === "trendyol") worksheet.spliceRows(0, 2);

  // Add a row by contiguous Array (assign to columns A, B & C)
  data.forEach((dataItem) => worksheet.addRow(Object.values(dataItem)));

  // Save workbook
  await workbook.xlsx.writeFile(
    `${homedir()}\\${outPath}\\${company.toUpperCase()}-${trademark}-${caseBrand}-${mainModalCode}-${new Date().toLocaleDateString(
      "tr"
    )}-${nanoId}.xlsx`
  );
}

export function registerPrompts() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  registerPrompt("search-list", require("inquirer-search-list"));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  registerPrompt("search-checkbox", require("inquirer-search-checkbox"));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  registerPrompt("directory", require("inquirer-directory"));
}

export const isObjectEmpty = (object: object) => {
  return Object.keys(object).length === 0;
};

export function setDefaultConfig() {
  // Setting config
  const configFile = readFileSync("./data/config.json", "utf8");
  const configData: ConfigFileData = JSON.parse(configFile);

  if (isObjectEmpty(configData)) {
    writeFile(
      "./data/config.json",
      JSON.stringify(configDefaultValues),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  }
}

export async function configPrompt() {
  setDefaultConfig();

  const configFile = readFileSync("./data/config.json", "utf8");
  const configData: ConfigFileData = JSON.parse(configFile);

  const configQuestions: QuestionCollection<ConfigOptions> = [
    // {
    //   name: "path",
    //   type: configQuestionsObject["path"].type,
    //   basePath: homedir(),
    //   message: configQuestionsObject["path"].message,
    //   default: configData["path"].defaultValue ?? undefined,
    //   when: configData["path"].alwaysAsk,
    // },
  ];

  const configDataKeys = Object.keys(configData);

  const dontAskValues: Partial<ConfigOptions> = {};

  for (let index = 0; index < configDataKeys.length; index++) {
    const key = configDataKeys[index] as keyof ConfigFileData;
    const configDataObj = configData[key];

    if (configDataObj.alwaysAsk === false) {
      dontAskValues[key] = configDataObj.defaultValue;
    }

    (configQuestions as Array<object>).push({
      ...configQuestionsObject[key],
      when: configDataObj.alwaysAsk,
      default: configDataObj.defaultValue
        ? configDataObj.defaultValue
        : undefined,
    });
  }

  const configOptions = await prompt(configQuestions);

  return { ...configOptions, ...dontAskValues };
}

// TODO: Create directory with json, array etc,
// TODO: Meeeh.
export function checkAndCreateDirectoryFile(
  directoryToCheck: string,
  fileToCheck: string
) {
  if (!existsSync(directoryToCheck)) {
    mkdirSync(directoryToCheck, { recursive: true });
  }

  if (!existsSync(fileToCheck)) {
    writeFileSync(fileToCheck, JSON.stringify({}));
  }
}

// TODO: Better implementation
export async function createCollection<
  CompanyT extends Companies[number] = Companies[number]
>(company: CompanyT, category: keyof ProductCategories[CompanyT]) {
  const collectionFile = readFileSync("./data/collections.json", "utf8");
  const collectionData: CollectionFileData = JSON.parse(collectionFile);

  const collectionName = await input({
    message: "Koleksiyon adı yazınız",
    validate(collectionName) {
      if (collectionData) {
        const collectionNameExists = !collectionData?.find(
          (c) =>
            c.category === category &&
            c.company === company &&
            c.collectionName.toLowerCase() === collectionName.toLowerCase()
        );
        return collectionNameExists ? true : "Koleksiyon adı kullanılmış!";
      } else {
        return lengthValidator(collectionName, true);
      }
    },
  });

  let collectionList: string[] = [];

  if (company === "trendyol") {
    switch (category) {
      case "phoneCase":
        collectionList = await prompt<{ collectionList: string[] }>({
          type: "search-checkbox",
          name: "collectionList",
          message: "Koleksiyon değerleri seçiniz",
          choices: [
            ...Trendyol_PhoneCase_PhonesList,
            ...Trendyol_PhoneCase_PhonesListExtend,
          ],
          validate: (input: string[]) => lengthValidator(input),
        }).then((o) => o.collectionList);
        break;
    }

    // TODO:
    const obj: CollectionFileData<"trendyol">[number] = {
      company: "trendyol",
      category: category as keyof ProductCategories["trendyol"],
      collectionName,
      values: collectionList,
    };
    collectionData?.push(obj as CollectionFileData[number]);
  } else if (company === "hepsiburada") {
    switch (category) {
      case "phoneCase":
        collectionList = await prompt<{ collectionList: string[] }>({
          type: "search-checkbox",
          name: "collectionList",
          message: "Koleksiyon değerleri seçiniz",
          choices: [
            ...Hepsiburada_PhoneCase_PhonesList,
            ...Hepsiburada_PhoneCase_PhonesListExtend,
          ],
          validate: (input: string[]) => lengthValidator(input),
        }).then((o) => o.collectionList);
        break;

        // default:
        break;
    }

    const obj: CollectionFileData<"hepsiburada">[number] = {
      company: "hepsiburada",
      category: category as keyof ProductCategories["hepsiburada"],
      collectionName,
      values: collectionList,
    };
    collectionData?.push(obj as CollectionFileData[number]);
  }

  writeFileSync("./data/collections.json", JSON.stringify(collectionData));
}
