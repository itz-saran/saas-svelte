import clerk from "$lib/clerk.server.js";
import { db } from "$lib/db/index.server.js";
import { user } from "$lib/db/schema.js";
import type { ClerkUser } from "$lib/types.js";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

async function insertUser(userId: string) {
	try {
		let clerkUser: ClerkUser | null = null;

		clerkUser = await clerk.users.getUser(userId);

		const dbUser = await db.query.user.findFirst({
			where: eq(user.id, clerkUser.id),
		});

		// ? If user is found return immediately
		if (dbUser) {
			return true;
		}

		// ? If no user is found try insert
		if (!dbUser) {
			await db.insert(user).values({
				id: clerkUser.id,
				email: clerkUser.emailAddresses[0].emailAddress,
			});
		}
		return true;
	} catch (error) {
		console.log("USER_SETUP_ERROR", error);
		return false;
	}
}

export async function load({ locals }) {
	const userId = locals.session?.userId;
	if (!userId) {
		throw redirect(302, "/sign-in");
	}
	return {
		streamed: {
			isAccountSetup: new Promise((resolve) => {
				insertUser(userId).then((val) => {
					resolve(val);
				});
			}),
		},
	};
}
