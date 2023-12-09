<script>
	import Navbar from "$components/Navbar.svelte";
	import { Toaster } from "svelte-french-toast";
	import "../app.pcss";
</script>

<Toaster position="top-right" />
<Navbar />
<slot />
