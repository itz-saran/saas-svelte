import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { handleClerk } from "clerk-sveltekit/server";
import { CLERK_SECRET_KEY, SECRET_DB_CONNECTION_STRING } from "$env/static/private";
import { PUBLIC_SIGN_IN_URL } from "$env/static/public";
import { initDB } from "$lib/db/index.server";

const protectedPaths = ["/dashboard", "/user-setup"];

initDB({
	connectionUrl: SECRET_DB_CONNECTION_STRING,
});

export const handle: Handle = sequence(
	handleClerk(CLERK_SECRET_KEY, {
		debug: true,
		protectedPaths,
		signInUrl: PUBLIC_SIGN_IN_URL,
	}),
);
