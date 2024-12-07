import config from "./lib/config";
import { defineConfig } from "drizzle-kit";

let sslmode = "";
if (config.APP_ENV === "prod") {
  sslmode = "?sslmode=require";
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: config.POSTGRES_URL + sslmode,
  },
  verbose: true,
  strict: true,
});