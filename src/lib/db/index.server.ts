import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

export let db: ReturnType<typeof drizzle<typeof schema>>;

type Options = {
	connectionUrl: string;
};

// Get type of second argument of migrate function
type MigrationOptions = Parameters<typeof migrate>["1"];

const migrationOptions: MigrationOptions = {
	migrationsFolder: "drizzle",
};

export const initDB = async (opts: Options) => {
	try {
		const client = postgres(opts.connectionUrl, { max: 1 });
		db = drizzle(client, { schema });
		await migrate(db, migrationOptions).then(() => {
			console.log("DB_MIGRATED");
		});
	} catch (error) {
		console.log("DB_ERROR", error);
	}
};
