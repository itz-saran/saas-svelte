import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { handleClerk } from "clerk-sveltekit/server";
import { CLERK_SECRET_KEY } from "$env/static/private";
import { PUBLIC_SIGN_IN_URL } from "$env/static/public";

const protectedPaths = ["/dashboard", "/user-setup"];

export const handle: Handle = sequence(
	handleClerk(CLERK_SECRET_KEY, {
		debug: true,
		protectedPaths,
		signInUrl: PUBLIC_SIGN_IN_URL,
	}),
);
