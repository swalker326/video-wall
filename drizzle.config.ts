import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

const dbUrl = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl || !authToken) {
	throw new Error("Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN in .env");
}

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	driver: "turso",
	dbCredentials: {
		url: dbUrl,
		authToken: authToken,
	},
});
