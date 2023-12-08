import { db } from "$lib/db/index.server.js";
import { file, user } from "$lib/db/schema.js";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function load({ locals, depends }) {
	// ? Giving an identifier so that we can invalidate the data after delete API call
	depends("file-data");
	const userId = locals.session?.userId;
	if (!userId) {
		throw redirect(302, "/sign-in");
	}

	const dbUser = await db.query.user.findFirst({
		where: eq(user.id, userId),
	});

	if (!dbUser) {
		throw redirect(302, "/user-setup");
	}

	// add mock files

	// await db.insert(file).values([
	// 	{
	// 		name: "mock1",
	// 		url: "/mock-1",
	// 		key: "mock-1",
	// 		userId: "user_2Z7Rksf1XHUAGylzTxwg5KIjhnU",
	// 	},
	// 	{
	// 		name: "mock2",
	// 		url: "/mock-2",
	// 		key: "mock-2",
	// 		userId: "user_2Z7Rksf1XHUAGylzTxwg5KIjhnU",
	// 	},
	// ]);

	return {
		user: dbUser,
		streaming: {
			// ? Only authencticated and synced users can access their files
			files: new Promise<(typeof file.$inferSelect)[]>((resolve) => {
				db.query.file
					.findMany({
						where: eq(file.userId, userId),
					})
					.then((files) => {
						resolve(files);
					});
			}),
		},
	};
}
