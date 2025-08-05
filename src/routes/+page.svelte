<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Department } from '$lib/types/Department';

    let {data} = $props()

    let searchTerm = $state('')
    let filteredResults: Department[] = $state([])
    $effect(()=>{
        if(searchTerm.trim() !== ''){
            filteredResults = data.departments.filter((iteration)=>iteration.department_name.toLowerCase().includes(searchTerm.toLowerCase()))
        } else [
            filteredResults = data.departments
        ]
        
    })
</script>

{#snippet button(text: string, onclick: any)}
    <button type="button" {onclick} class="h-9 px-2 rounded-md bg-slate-500 text-white font-bold hover:brightness-90">{text}</button>
{/snippet}

<h1 class="text-2xl">Departments</h1>

<!-- Search and add buttons -->
<div class="mb-4">
    <input type="text" bind:value={searchTerm} placeholder="Search..." class="border border-zinc-400 rounded-md h-9 p-2"/>
    {@render button('Search', ()=>{})}
    {@render button('Add', ()=>{goto('/department/0')})}
</div>

<!-- List departments -->
{#each filteredResults as department}
    <div class="flex odd:bg-zinc-200 items-center gap-3 p-2">
        {@render button('Edit', ()=>{goto('/department/'+department.department_id)})}
        {department.department_name}
    </div>
{/each}
{#if filteredResults.length === 0}
    <div class="p-4 bg-zinc-200">No departments found, add one above</div>
{/if}