import { Db } from "./types";
import fs from "fs";

export const getDb = async (): Promise<Db> => {
  const content = fs.readFileSync("./db.json", "utf-8");
  return JSON.parse(content);
};

export const updateDb = async (db: Db): Promise<void> => {
  fs.writeFileSync("./db.json", JSON.stringify(db), "utf-8");
};
