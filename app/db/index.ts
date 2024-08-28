import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

config({ path: ".env" }); // or .env.local
const dbUrl = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl || !authToken) {
	throw new Error("Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN in .env");
}

const client = createClient({
	url: dbUrl,
	authToken: authToken,
});

export const db = drizzle(client, { schema });
