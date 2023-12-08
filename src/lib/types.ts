import type { User } from "@clerk/clerk-sdk-node/esm/instance";

export type ClerkUser = User;

export type EventHelper<EventType extends Event, TargetElement extends HTMLElement> = EventType & {
	currentTarget: EventTarget & TargetElement;
};
