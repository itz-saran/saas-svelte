import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

// Get type of second argument of migrate function
type MigrationOptions = Parameters<typeof migrate>["1"];

const migrationOptions: MigrationOptions = {
	migrationsFolder: "drizzle",
};

async function main() {
	const { DB_CONNECTION_STRING } = process.env;
	if (!DB_CONNECTION_STRING) {
		throw new Error("No connection string available");
	}

	try {
		const client = postgres(DB_CONNECTION_STRING, { max: 1 });
		const db = drizzle(client);
		await migrate(db, migrationOptions);
		console.log("DB_MIGRATED");
		process.exit(0);
	} catch (error) {
		console.log("MIGRATION_ERROR", error);
	}
}

main();
