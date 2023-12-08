<script lang="ts">
	import { cn } from "$lib/utils";

	export let count: number = 1;
	export let className: string = "";
</script>

{#each Array(count) as _}
	<div class={cn("skeleton", className)}></div>
{/each}

<style>
	.skeleton {
		display: block;
		position: relative;
		overflow: hidden;
		background-color: #dddbdd;
	}

	.skeleton::after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transform: translateX(-100%);
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0,
			rgba(255, 255, 255, 0.2) 20%,
			rgba(255, 255, 255, 0.5) 60%,
			rgba(255, 255, 255, 0)
		);
		animation: shimmer 2s linear infinite;
		content: "";
	}

	@keyframes shimmer {
		100% {
			transform: translateX(100%);
		}
	}
</style>
