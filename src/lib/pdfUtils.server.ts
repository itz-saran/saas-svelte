// import { HUGGINGFACE_API_ENDPOINT, HUGGINGFACE_API_KEY } from "$env/static/private";
import { z } from "zod";
import pdfjs from "$lib/pdfjs.lib";
import { getDB } from "$lib/db/mongo.server";
import { db } from "$lib/db/index.server";
import { file } from "$lib/db/schema";
import { and, eq } from "drizzle-orm";

// type EndpointBodyParams = {
// 	inputs: {
// 		question: string;
// 		context: string;
// 	};
// };

// export async function requestDeepsetMLEndpoint(data: EndpointBodyParams) {
// 	const response = await fetch(HUGGINGFACE_API_ENDPOINT, {
// 		headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
// 		method: "POST",
// 		body: JSON.stringify(data),
// 	});
// 	const result = await response.json();
// 	return result;
// }

const TextItemSchema = z.object({
	str: z.string(),
	dir: z.string(),
	transform: z.array(z.any()),
	width: z.number(),
	height: z.number(),
	fontName: z.string(),
	hasEOL: z.boolean(),
});

async function uploadProcessedText({
	text,
	fileId,
	userId,
}: {
	text: string;
	fileId: string;
	userId: string;
}) {
	const db = await getDB("pdf-data");
	if (!db) throw "Could not connect to mongo";
	const collection = db.collection("extracts");
	const result = await collection.insertOne({
		text,
		fileId,
		userId,
	});
	return result;
}

export async function indexPDF({
	fileUrl,
	id,
	userId,
}: {
	fileUrl: string;
	id: string;
	userId: string;
}) {
	const response = await fetch(fileUrl);
	const fileBuffer = await response.arrayBuffer();
	const loadingTask = pdfjs.getDocument(fileBuffer);
	const pdf = await loadingTask.promise;
	let text = "";

	for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
		const page = await pdf.getPage(pageNumber);
		const textContent = await page.getTextContent();
		for (let i = 0; i < textContent.items.length; i++) {
			const result = TextItemSchema.safeParse(textContent.items[i]);
			if (result.success) {
				text += result.data.str + " ";
			}
		}
		text += "\n";
	}

	try {
		await uploadProcessedText({
			text,
			fileId: id,
			userId,
		});
		await db
			.update(file)
			.set({
				uploadStatus: "SUCCESS",
			})
			.where(and(eq(file.id, id), eq(file.userId, userId)));
	} catch(e) {
		console.log("FILE INDEX ERROR", e)
		await db
			.update(file)
			.set({
				uploadStatus: "FAILED",
			})
			.where(and(eq(file.id, id), eq(file.userId, userId)));
	}
}
