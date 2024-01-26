// @ts-expect-error declaration file not found
import pdfParse from "pdf-parse/lib/pdf-parse";
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
	const extracts = db.collection("extracts");
	const existingDocument = await extracts.findOne({
		fileId,
		userId,
	});
	let result;
	if (existingDocument) {
		result = await extracts.findOneAndUpdate(
			{
				fileId,
				userId,
			},
			{
				$set: {
					text,
				},
			},
		);
		return { result, isNew: false };
	}

	result = await extracts.insertOne({
		text,
		fileId,
		userId,
	});

	return { result, isNew: true };
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

	const pdf = await pdfParse(Buffer.from(fileBuffer));

	console.log("pdf text", pdf.text);

	try {
		const result = await uploadProcessedText({
			text: pdf.text,
			fileId: id,
			userId,
		});

		if (result.isNew) {
			await db
				.update(file)
				.set({
					uploadStatus: "SUCCESS",
				})
				.where(and(eq(file.key, id), eq(file.userId, userId)));
		}
	} catch (e) {
		await db
			.update(file)
			.set({
				uploadStatus: "FAILED",
			})
			.where(and(eq(file.key, id), eq(file.userId, userId)));
	}
}
