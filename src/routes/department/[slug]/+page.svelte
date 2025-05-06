<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import type { IDepartment } from '$lib/server/department';
    import { onMount } from 'svelte';

    let department: IDepartment = {
        department_id: 0,
        department_name: ''
    }

    onMount(async ()=>{
        const response = await fetch('/api/department/'+page.params.slug)
        try {
            const json = await response.json()
            department = json.department
        } catch(error:any){
            alert(error.toString())
        }
    })

    const saveRecord = async () => {
        try{
            // try catch because json might crash the app if bad

            const formData = JSON.stringify(department)
            let method = 'PUT'
            if(department.department_id === 0){
                method = 'POST'
            }
            const response = await fetch('/api/department/'+page.params.slug, {
                method:method,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
                body: formData
            })
            const json = await response.json()

            if(json.status !== 200){
                alert(json.message)
            } else {
                alert('Saved!')
                goto('/') // go back to dept. list
            }

        } catch (error:any){
            alert(error.toString())
        }
    }

    const deleteRecord = async () => {
        try{
            // try catch because json might crash the app if bad

            const formData = JSON.stringify(department)
            const method = 'DELETE'
            const response = await fetch('/api/department/'+page.params.slug, {
                method:method,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
                body: formData
            })
            const json = await response.json()

            if(json.status !== 200){
                alert(json.message)
            } else {
                alert('Deleted!')
                goto('/') // go back to dept. list
            }

        } catch (error:any){
            alert(error.toString())
        }
    }
</script>
{#snippet button(text: string, onclick: any)}
    <button type="button" {onclick} class="h-9 px-2 rounded-md bg-slate-500 text-white font-bold hover:brightness-90">{text}</button>
{/snippet}
<h1 class="text-2xl">Add/Edit Department</h1>
<div class="mb-4">
    <input type="text" bind:value={department.department_name} placeholder="Department name..." class="border border-zinc-400 rounded-md h-9 p-2"/>
    {@render button('Save', saveRecord)}
    {@render button('Cancel', ()=>{goto('/')})}

    {#if department.department_id > 0}
        {@render button('Delete', deleteRecord)}
    {/if}
</div>