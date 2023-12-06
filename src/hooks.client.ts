import type { HandleClientError } from "@sveltejs/kit";
// To use Clerk components:
import { initializeClerkClient } from "clerk-sveltekit/client";
// Or for headless mode:
// import { initializeClerkClient } from 'clerk-sveltekit/headless'
import {
	PUBLIC_CLERK_PUBLISHABLE_KEY,
	PUBLIC_AFTER_SIGN_IN_URL,
	PUBLIC_AFTER_SIGN_UP_URL,
	PUBLIC_SIGN_IN_URL,
	PUBLIC_SIGN_UP_URL,
} from "$env/static/public";

initializeClerkClient(PUBLIC_CLERK_PUBLISHABLE_KEY, {
	afterSignInUrl: PUBLIC_AFTER_SIGN_IN_URL,
	afterSignUpUrl: PUBLIC_AFTER_SIGN_UP_URL,
	signInUrl: PUBLIC_SIGN_IN_URL,
	signUpUrl: PUBLIC_SIGN_UP_URL,
});

export const handleError: HandleClientError = async ({ error, event }) => {
	console.error(error, event);
};
