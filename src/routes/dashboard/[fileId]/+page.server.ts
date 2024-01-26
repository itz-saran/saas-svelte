import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/db/index.server";
import { eq, and } from "drizzle-orm";
import { file } from "$lib/db/schema";

export const load = (async ({ params, locals, depends }) => {
	depends("individual-file");
	const userId = locals.session?.userId;
	if (!userId) {
		throw redirect(302, "/sign-in");
	}

	const dbFile = await db.query.file.findFirst({
		where: and(eq(file.key, params.fileId)),
	});

	if (!dbFile) {
		throw error(404, "Not found");
	}

	return {
		file: dbFile,
	};
}) satisfies PageServerLoad;
