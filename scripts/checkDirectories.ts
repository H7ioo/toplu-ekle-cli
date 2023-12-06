import * as fs from "fs";
import * as path from "path";
import { companies } from "../lib/variables";
import { Companies } from "../lib/types";
import { logger } from "../lib/logger";

const companiesDir = path.join(__dirname, "../companies"); // Adjust the path as needed

// Function to check if a file exists
function fileExists(filePath: string) {
  return fs.existsSync(filePath);
}

// Function to check if all required files exist in a directory
function checkDirectory(directory: string) {
  const requiredFiles = ["variables.ts", "prompts.ts", "types.ts"];
  const directoryName = path.basename(directory);
  const xlsxFile = `${directoryName}.xlsx`;

  for (const file of requiredFiles) {
    if (!fileExists(path.join(directory, file))) {
      console.error(
        `Missing required file '${file}' in directory '${directoryName}'.`
      );
      return false;
    }
  }

  if (!fileExists(path.join(directory, xlsxFile))) {
    // Company directories doesn't contain xlsx file
    if (companies.includes(directoryName as Companies[number])) return true;
    console.error(
      `Missing required file '${xlsxFile}' in directory '${directoryName}'.`
    );
    return false;
  }

  return true;
}

// Function to recursively check directories
function checkDirectories(directory: string) {
  const items = fs.readdirSync(directory);
  for (const item of items) {
    const itemPath = path.join(directory, item);
    if (fs.statSync(itemPath).isDirectory()) {
      if (!checkDirectory(itemPath)) {
        process.exit(1);
      }
      checkDirectories(itemPath); // Recursively check subdirectories
    }
  }
}

// Start checking from the 'companies' directory
checkDirectories(companiesDir);

logger.info("All required files are present in the specified directories.");
