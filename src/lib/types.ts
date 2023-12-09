import type { User } from "@clerk/clerk-sdk-node/esm/instance";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export type ClerkUser = User;

export type EventHelper<EventType extends Event, TargetElement extends HTMLElement> = EventType & {
	currentTarget: EventTarget & TargetElement;
};

export type UploadResponseType = {
	success: boolean;
	error?: UploadApiErrorResponse;
	data?: UploadApiResponse;
};

export type DeleteResponseType = {
	success: boolean;
	error?: string;
	data?: string;
};
