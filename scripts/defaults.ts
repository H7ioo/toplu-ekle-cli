import { confirm, input, select } from "@inquirer/prompts";
import { companies, defaultsDefaultValues } from "../lib/variables";
import { Defaults } from "../lib/types";
import { returnDataFile } from "../lib/utils";
import { writeFileSync } from "fs";

(async () => {
  const company = await select({
    choices: companies.map((c) => ({ value: c })),
    message: "Şirket seçiniz:",
  });

  const def = (await select({
    choices: Object.keys(defaultsDefaultValues[company]).map((i) => ({
      value: i,
    })),
    message: "Seçenek seçiniz:",
  })) as keyof Defaults[typeof company];

  const value = await input({ message: `${def} için değer yazınız:` });

  const alwaysAsk = await confirm({
    message: "Her zaman sorulsun mu?",
    default: true,
  });

  writeFileSync(
    "./data/defaults.json",
    JSON.stringify({
      ...returnDataFile("defaults"),
      [company]: {
        ...returnDataFile("defaults")[company],
        [def]: {
          value,
          alwaysAsk,
        },
      },
    })
  );
})();
