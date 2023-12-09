import {
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	CLOUDINARY_CLOUD_NAME,
} from "$env/static/private";
import type { DeleteResponseType, UploadResponseType } from "$lib/types";
import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadFile(buffer: Buffer, fileName: string): Promise<UploadResponseType> {
	const options: UploadApiOptions = {
		resource_type: "auto",
		folder: "sparrow",
		use_filename: true,
		public_id: fileName,
		unique_filename: true,
	};
	// upload_stream uses node buffer to upload and return response
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(options, (err, res) => {
				if (err || !res) {
					return reject({ success: false, error: err });
				}
				return resolve({ success: true, data: res });
			})
			.end(buffer);
	});
}

export async function deleteFile(...files: string[]): Promise<DeleteResponseType> {
	return new Promise((resolve, reject) => {
		cloudinary.api.delete_resources(
			files,
			{
				type: "upload",
				resource_type: "image",
			},
			(err, res) => {
				if (err && !res) {
					return reject({ success: false, error: "Cloudinary error" });
				}
				return resolve({ success: true, data: Object.keys(res.deleted)[0] });
			},
		);
	});
}

export default cloudinary;
