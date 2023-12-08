import { CLERK_SECRET_KEY } from "$env/static/private";
import clerk from "$lib/clerk.server.js";
import cloudinary from "$lib/cloudinary.server.js";
import { db } from "$lib/db/index.server.js";
import { file } from "$lib/db/schema.js";
import { error, json } from "@sveltejs/kit";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { and, eq } from "drizzle-orm";

type UploadResponseType = {
	success: boolean;
	error: UploadApiErrorResponse | null;
	data?: UploadApiResponse;
};
async function upload(buffer: Buffer): Promise<UploadResponseType> {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ resource_type: "auto" }, (err, res) => {
				if (err || !res) {
					return reject({ success: false, error: err, data: null });
				}
				return resolve({ success: true, error: null, data: res });
			})
			.end(buffer);
	});
}

export async function POST({ request }) {
	const data = request.formData();
	const file = (await data).get("file") as File;
	if (!file) {
		throw error(400, "File is missing");
	}
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const response = await upload(buffer)
	console.log("file data", response);
	return json({ success: true });
}

export async function DELETE({ request }) {
	const authState = await clerk.authenticateRequest({
		secretKey: CLERK_SECRET_KEY,
		request,
	});

	const { fileId } = (await request.json()) as { fileId: string };

	if (!authState.isSignedIn) {
		throw error(401, "Unauthorized");
	}

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
		await db.delete(file).where(eq(file.id, fileInDb.id));
	} catch (err) {
		throw error(500, "Internal server error");
	}

	return json({ success: true, message: "File delted successfully" });
}
