// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: {
				userId: string;
				claims: {
					azp: string;
					exp: number;
					iat: number;
					iss: string;
					nbf: number;
					sid: string;
					sub: string;
				};
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
