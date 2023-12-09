<script lang="ts">
	import Button from "$components/ui/button/button.svelte";
	import Dropzone from "$components/Dropzone.svelte";
	import { Root, Trigger, Content } from "$components/ui/dialog";
	let isOpen = false;
</script>

<Root
	open={isOpen}
	onOpenChange={(visible) => {
		if (!visible) {
			isOpen = visible;
		}
	}}
>
	<Trigger
		on:click={() => {
			isOpen = true;
		}}
	>
		<Button>Upload PDF</Button>
	</Trigger>
	<Content>
		<Dropzone />
	</Content>
</Root>
