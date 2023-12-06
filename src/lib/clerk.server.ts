import { CLERK_SECRET_KEY } from "$env/static/private";
import Clerk from "@clerk/clerk-sdk-node/esm/instance";

const clerk = Clerk({
	secretKey: CLERK_SECRET_KEY,
});

export default clerk;
