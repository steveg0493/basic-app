import { db } from "$lib/db/db";
import { DepartmentTable } from "$lib/db/schema";
import type { Department } from "$lib/common/types/Department";
import { json } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";

export async function GET({ params }) {
  const department_id: number = Number(params.slug);

  let department: Department[] | null = await db
    .select()
    .from(DepartmentTable)
    .where(eq(DepartmentTable.department_id, department_id))
    .limit(1);
  console.log(department);
  if (department.length > 0) {
    return json({ department: department[0] });
  } else {
    return json({
      department: { department_id: 0, department_name: "" },
    });
  }
}

export async function POST({ request }) {
  const data = await request.json();

  try {
    const department: Department[] = await db
      .insert(DepartmentTable)
      .values({
        department_name: data.department_name,
      })
      .returning();

    return json({ status: 200, department: department[0] });
  } catch (error) {
    return json({ status: 400, message: error });
  }
}

export async function PUT({ request }) {
  const data = await request.json();

  try {
    const department: Department[] = await db
      .update(DepartmentTable)
      .set({ department_name: data.department_name })
      .where(eq(DepartmentTable.department_id, Number(data.department_id)))
      .returning();

    return json({ status: 200, department: department[0] });
  } catch (error) {
    return json({ status: 400, message: error });
  }
}

export async function DELETE({ params }) {
  try {
    await db
      .delete(DepartmentTable)
      .where(eq(DepartmentTable.department_id, Number(params.slug)));
    return json({ status: 200 });
  } catch (error) {
    return json({ status: 400, message: error });
  }
}
