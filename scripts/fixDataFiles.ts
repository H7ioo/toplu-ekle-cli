import { writeFileSync } from "fs";
import { returnDataFile } from "../lib/utils";
import { dataFiles, dataFilesInitialValue } from "../lib/variables";

(() => {
  for (const dataFile of dataFiles) {
    const path = `./data/${dataFile}.json`;
    const data = returnDataFile(dataFile);
    const initialValue = dataFilesInitialValue[dataFile];

    // TODO: Array doesn't really matter because the initial value is almost always the same []
    if (Array.isArray(data) && Array.isArray(initialValue)) {
      writeFileSync(path, JSON.stringify([...initialValue, ...data]));
    } else {
      writeFileSync(path, JSON.stringify({ ...initialValue, ...data }));
    }
  }
})();
