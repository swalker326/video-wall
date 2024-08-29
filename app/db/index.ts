import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbUrl = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl) {
	throw new Error("Missing TURSO_AUTH_TOKEN in .env");
}
if (!authToken) {
	throw new Error("Missing TURSO_CONNECTION_URL in .env");
}

const client = createClient({
	url: dbUrl,
	authToken: authToken,
});

export const db = drizzle(client, { schema });
