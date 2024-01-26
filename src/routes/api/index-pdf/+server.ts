import { CLERK_SECRET_KEY } from "$env/static/private";
import clerk from "$lib/clerk.server.js";
import { db } from "$lib/db/index.server.js";
import { file } from "$lib/db/schema.js";
import { indexPDF } from "$lib/pdfUtils.server.js";
import { error, json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const postRequestBodySchema = z.object({
	fileId: z.string(),
});

export async function POST({ request }) {
	const authState = await clerk.authenticateRequest({
		secretKey: CLERK_SECRET_KEY,
		request,
	});

	if (!authState.isSignedIn) {
		throw error(401, "Unauthorized");
	}
	const body = await request.json();
	const result = postRequestBodySchema.safeParse(body);

	if (!result.success) {
		throw error(400, "File id not provided");
	}

	const { fileId } = result.data;

	const { userId } = authState.toAuth();

	// ? Find if the file exists and owned by current user
	const fileInDb = await db.query.file.findFirst({
		where: and(eq(file.id, fileId), eq(file.userId, userId)),
	});

	// ? If no file found return an error
	if (!fileInDb) {
		throw error(404, "File not found");
	}

	await indexPDF({
		fileUrl: fileInDb.url,
		id: fileInDb.key,
		userId: userId,
	});

	return json({ success: true, message: "file processed" });
}
