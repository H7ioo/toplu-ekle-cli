import { confirm, select } from "@inquirer/prompts";
import { writeFile } from "fs";
import { prompt } from "inquirer";
import { registerPrompts, returnDataFile } from "../lib/utils";
import { configQuestionsObject } from "../lib/variables";
registerPrompts();

// TODO: CONFIG CONCEPT, IT'S SO BAD AND NOT CLEAN

(async () => {
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

  const configData = returnDataFile("config");

  configData[option] = result[option]!;

  writeFile("./data/config.json", JSON.stringify(configData), (err) => {
    if (err) {
      console.log(err);
    }
  });
})();
