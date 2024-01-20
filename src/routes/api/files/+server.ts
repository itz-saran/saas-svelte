import { CLERK_SECRET_KEY } from "$env/static/private";
import clerk from "$lib/clerk.server.js";
import { deleteFile, uploadFile } from "$lib/cloudinary.server.js";
import { db } from "$lib/db/index.server.js";
import { deletePDFExtract } from "$lib/db/mongo.server.js";
import { file } from "$lib/db/schema.js";
import { indexPDF } from "$lib/pdfUtils.server.js";
import type { DeleteResponseType } from "$lib/types.js";
import { error, json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export async function POST({ request }) {
	const authState = await clerk.authenticateRequest({ request, secretKey: CLERK_SECRET_KEY });
	const user = authState.toAuth();
	if (!authState.isSignedIn || !user?.userId) {
		throw error(401, "Unauthorized");
	}
	/**
	 * Create array buffer from form data to create NodeBuffer and use cloudinary to upload
	 */
	const data = request.formData();
	const fileToUpload = (await data).get("file") as File;
	if (!fileToUpload) {
		throw error(400, "File is missing");
	}
	const arrayBuffer = await fileToUpload.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	try {
		const { data, success } = await uploadFile(buffer, `${fileToUpload.name}_at_${Date.now()}`);
		if (!success || !data || !data.asset_id) {
			throw error(500, "Internal server error");
		}

		// Add the file url to our database
		await db.insert(file).values({
			key: data.asset_id,
			name: data.public_id,
			url: data.secure_url,
			uploadStatus: "PROCESSING",
			userId: user.userId,
		});

		indexPDF({
			fileUrl: data.secure_url,
			id: data.asset_id,
			userId: user.userId,
		});

		return json({ success: true, message: "File uploaded successfully", file: data });
	} catch (err) {
		throw error(500, "Internal server error");
	}
}

const deleteRequestBodySchema = z.object({
	fileId: z.string(),
});

export async function DELETE({ request }) {
	const authState = await clerk.authenticateRequest({
		secretKey: CLERK_SECRET_KEY,
		request,
	});

	if (!authState.isSignedIn) {
		throw error(401, "Unauthorized");
	}
	const body = await request.json();
	const result = deleteRequestBodySchema.safeParse(body);

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

	try {
		// ? First delete from cloudinary. If that is success, then clear from db
		const cloudinaryDeleteStatus: DeleteResponseType = await deleteFile(fileInDb.name);
		if (cloudinaryDeleteStatus.success && cloudinaryDeleteStatus.data) {
			await db.delete(file).where(eq(file.id, fileInDb.id));
			await deletePDFExtract({
				fileId: fileInDb.key,
				userId,
			}).catch((e) => {
				console.log("mongo delete error", e);
			});
		} else {
			throw error(500, "Internal server error");
		}
	} catch (err) {
		console.log("FILE DELETE ERROR", err);
		throw error(500, "Internal server error");
	}

	return json({ success: true, message: "File deleted successfully" });
}
