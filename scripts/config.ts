import { confirm, select } from "@inquirer/prompts";
import { readFileSync, writeFile } from "fs";
import { prompt } from "inquirer";
import { ConfigFileData } from "../lib/types";
import { registerPrompts, setDefaultConfig } from "../lib/utils";
import { configQuestionsObject } from "../lib/variables";
registerPrompts();

// TODO: CONFIG CONCEPT, IT'S SO BAD AND NOT CLEAN

(async () => {
  setDefaultConfig();

  const option = await select({
    message: "Değiştirmek istediğiniz seçeneği seçiniz",
    choices: (
      Object.keys(
        configQuestionsObject
      ) as (keyof typeof configQuestionsObject)[]
    ).map((option) => ({
      value: option,
    })),
  });

  const questionObject = configQuestionsObject[option];
  const values = await prompt(questionObject);

  const alwaysAsk = await confirm({
    message: "Her zaman sorulsun mu?",
    default: true,
  });

  const result = {
    [option]: {
      name: option,
      defaultValue: Object.values(values)[0],
      alwaysAsk,
    },
  };

  const configFile = readFileSync("./data/config.json", "utf8");
  const configData: ConfigFileData = JSON.parse(configFile);

  configData.path = result[option];

  writeFile("./data/config.json", JSON.stringify(configData), (err) => {
    if (err) {
      console.log(err);
    }
  });
})();
