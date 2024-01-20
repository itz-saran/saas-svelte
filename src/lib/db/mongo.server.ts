import { MONGODB_ATLAS_ENDPOINT } from "$env/static/private";
import { MongoClient, ServerApiVersion } from "mongodb";
import { z } from "zod";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGODB_ATLAS_ENDPOINT, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export async function connectMongo() {
	// Connect the client to the server	(optional starting in v4.7)
	return await client.connect();
}

export async function closeMongo() {
	// Ensures that the client will close when you finish/error
	return await client.close();
}

export async function deletePDFExtract({ fileId, userId }: { fileId: string; userId: string }) {
	const db = await getDB("pdf-data");
	if (!db) throw "Internal server error";
	const extracts = db.collection("extracts");
	const query = {
		fileId,
		userId,
	};
	const result = await extracts.deleteOne(query);
	console.log({ count: result.deletedCount });
	if (result.acknowledged) return true;
	return false;
}

export const pdfExtractSchema = z.object({});

export async function getPdfExtract({ fileId, userId }: { fileId: string; userId: string }) {
	const db = await getDB("pdf-data");
	if (!db) throw "Internal server error";
	const extracts = db.collection("extracts");
	const query = {
		fileId,
		userId,
	};
	const result = await extracts.findOne(query);
	return result;
}

export async function getDB(dbName: string) {
	try {
		// Send a ping to confirm a successful connection
		const db = client.db(dbName);
		const ping = await db.command({ ping: 1 });
		if (ping) {
			return db;
		} else {
			return null;
		}
	} catch {
		return null;
	}
}
