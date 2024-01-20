<script lang="ts">
	import type { HTMLTextareaAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	type $$Props = HTMLTextareaAttributes & {
		autoresize: boolean;
	};

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let autoresize: $$Props["autoresize"] = false;
	export { className as class };

	function autoResize(node: HTMLTextAreaElement, isResizeTrue: boolean) {
		if (!isResizeTrue) {
			return;
		}

		const autoGrow = () => {
			node.style.height = "auto";
			node.style.height = node.scrollHeight + 2 + "px";
		};

		node.addEventListener("input", autoGrow);

		return {
			destroy() {
				node.removeEventListener("input", autoGrow);
			},
		};
	}
</script>

<!-- svelte-ignore a11y-autofocus -->
<textarea
	use:autoResize={autoresize}
	class={cn(
		"flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className,
		{
			"min-h-[80px]": !autoresize,
		},
	)}
	autofocus
	bind:value
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
	{...$$restProps}
/>
