import { confirm, select } from "@inquirer/prompts";
import { prompt } from "inquirer";
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
  const { defaultValue } = await prompt<{ defaultValue: string }>(
    questionObject
  );

  const alwaysAsk = await confirm({
    message: "Her zaman sorulsun mu?",
    default: true,
  });

  console.log({
    [option]: {
      name: option,
      defaultValue,
      alwaysAsk,
    },
  });
})();
