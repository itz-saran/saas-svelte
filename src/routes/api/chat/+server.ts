import { CLERK_SECRET_KEY } from "$env/static/private";
import { getAIResponse } from "$lib/ai.server.js";
import clerk from "$lib/clerk.server";
import { db } from "$lib/db/index.server.js";
import { getPdfExtract } from "$lib/db/mongo.server.js";
import { file } from "$lib/db/schema.js";
import { indexPDF } from "$lib/pdfUtils.server.js";
import { error, json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const postRequestBodySchema = z.object({
	fileId: z.string(),
	message: z.string(),
});

export async function POST({ request }) {
	const authState = await clerk.authenticateRequest({
		secretKey: CLERK_SECRET_KEY,
		request,
	});

	if (!authState.isSignedIn) {
		throw error(401, "Unauthorized");
	}

	const { userId } = authState.toAuth();

	const body = await request.json();
	console.log("body", body);
	const result = postRequestBodySchema.safeParse(body);

	if (!result.success) {
		throw error(400, "Required data not found in request body");
	}

	const { fileId, message: userMessage } = result.data;

	const fileInDb = await db.query.file.findFirst({
		where: and(eq(file.id, fileId), eq(file.userId, userId)),
	});

	if (!fileInDb) {
		throw error(404, "File not found");
	}

	const fileExtract = await getPdfExtract({ fileId: fileInDb.key, userId });

	if (!fileExtract || !fileExtract.text) {
		indexPDF({ fileUrl: fileInDb.url, id: fileInDb.key, userId });
		throw error(404, "PDF not yet processed. Please try again after some time");
	}

	const stream = await getAIResponse({
		inputs: { question: userMessage, context: fileExtract.text },
	});

	console.log(stream);
	// if (stream) return new StreamingTextResponse(stream);
	return json({ message: "AI error", success: false });
}
