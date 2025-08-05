import { json } from "@sveltejs/kit";
import { db } from "$lib/db.server";
import type { Department } from "$lib/types/Department";

export async function GET({ params }) {
  const department_id = params.id;

  let department: Department | null = await db.department.findUnique({
    where: {
      department_id: Number(department_id),
    },
  });

  if (!department) {
    department = {
      department_id: 0,
      department_name: "",
    };
  }

  return json({ department });
}

export async function POST({ request }) {
  const data = await request.json();

  const result: Department = await db.department.create({
    data: {
      department_name: data.department_name,
    },
  });

  console.log(result);

  if ("error" in result) {
    return json({ status: 400, message: result.error });
  }

  return json({ status: 200, department: result });
}

export async function PUT({ request }) {
  const data = await request.json();

  const result = await db.department.update({
    where: {
      department_id: data.department_id,
    },
    data: {
      department_name: data.department_name,
    },
  });

  if ("error" in result) {
    return json({ status: 400, message: result.error });
  }

  return json({ status: 200 });
}

export async function DELETE({ params }) {
  await db.department.delete({
    where: {
      department_id: Number(params.id),
    },
  });
  return json({ status: 200 });
}
