<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
</script>

<div style="box-shadow: 0 215px 0 -100px #52525c inset;">
    <!-- Centered main content -->
    <div class=" container md:mx-auto px-3 md:px-0">
        <!-- Top nav bar -->
        <div class=" bg-zinc-600 text-white py-3 flex justify-between">
            <!-- left Logo -->
            <img src="/SlateDevLogo.png" alt="Slate Dev Logo" class="md:h-10 h-8"/>
        </div>
        <!-- Main content -->
        <div class="rounded-lg bg-zinc-100 p-4 min-h-64">
            {@render children()}
        </div>
    </div>
</div>