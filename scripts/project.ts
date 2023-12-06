import { select } from "@inquirer/prompts";
import { databases, projectDefaultValues } from "../lib/variables";
import { returnDataFile } from "../lib/utils";
import { writeFileSync } from "fs";

(async () => {
  // Select transaction (fielding)
  // Select an option in that field, based on what? it might be string boolean or literal

  const field = (await select({
    choices: Object.keys(projectDefaultValues).map((i) => ({ value: i })),
    message: "Seçenek seçiniz:",
  })) as keyof typeof projectDefaultValues;

  // TODO: Object implementation
  let value;

  if (field === "database") {
    value = await select({
      choices: databases.map((i) => ({ value: i })),
      message: "Veri tabanı seçiniz:",
    });
  }

  const project = returnDataFile("project");

  writeFileSync(
    "./data/project.json",
    JSON.stringify({ ...project, [field]: value })
  );
})();
