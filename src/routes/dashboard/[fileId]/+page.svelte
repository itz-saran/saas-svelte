<script lang="ts">
	import type { PageData } from "./$types";
	import PDFRenderer from "$components/PDFRenderer.svelte";
	import ChatWrapper from "$components/chat/ChatWrapper.svelte";
	import { onMount } from "svelte";
	import { invalidate } from "$app/navigation";
	import toast from "svelte-french-toast";
	export let data: PageData;

	onMount(async () => {
		if (data.file.uploadStatus === "PROCESSING" || data.file.uploadStatus === "PENDING") {
			try {
				const response = await fetch("/api/index-pdf", {
					method: "POST",
					body: JSON.stringify({ fileId: data.file.id }),
					headers: {
						"Content-type": "application/json; charset=UTF-8",
					},
				});

				const responseJson: {
					success: boolean;
					message: string;
				} = await response.json();

				if (responseJson.success) {
					toast.success(responseJson.message);
					invalidate("individual-file");
				}
			} catch (e) {
				toast.error((e as Error).message);
			}
		}
	});
</script>

<div class="flex-1 justify-between flex flex-col max-h-[calc(100vh-3.5rem)]">
	<div class="mx-auto h-full w-full max-w-8xl grow lg:flex xl:px-2">
		<!-- Left side  -->
		<div class="xl:flex lg:w-[60%]">
			<div class="w-full max-h-full px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
				<!-- PDF renderer -->
				<PDFRenderer url={data.file.url} name={data.file.name} />
			</div>
		</div>
		<!-- Chat -->
		<div class="shrink-0 lg:w-[40%] border-t border-gray-200 lg:border-l lg:border-t-0">
			<ChatWrapper file={data.file} />
		</div>
	</div>
</div>
