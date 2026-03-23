import fs from "fs";
import path from "path";
import { Credentials } from "./types";

export function loadCredentials(filePath = "credentials.json"): Credentials {
  const absPath = path.resolve(filePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(
      `${filePath} not found. Copy credentials.example.json to credentials.json and fill in your credentials.`
    );
  }

  const raw = fs.readFileSync(absPath, "utf-8");
  return JSON.parse(raw) as Credentials;
}