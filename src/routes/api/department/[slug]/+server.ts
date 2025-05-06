import { Department, type IDepartment } from '$lib/server/department.js'
import { json } from '@sveltejs/kit'

export async function GET({params}) {
    const department_id = params.slug

    let department = await Department().getSingle(Number(department_id))

    if(!department){
        department = {
            department_id: 0,
            department_name: ''
        }
    }

    return json({department})
}

export async function POST({request}) {
    const data = await request.json()

    const department: IDepartment = {
        department_id: 0,
        department_name: data.department_name,
    }
    const result = await Department().insert(department)

    if('error' in result){
        return json({status:400, message:result.error})
    }

    return json({status:200})
}

export async function PUT({request}) {
    const data = await request.json()

    const department: IDepartment = {
        department_id: data.department_id,
        department_name: data.department_name,
    }
    const result = await Department().update(department)

    if('error' in result){
        return json({status:400, message:result.error})
    }

    return json({status:200})
}

export async function DELETE({params}) {
    await Department().delete(Number(params.slug))
    return json({status:200})
}