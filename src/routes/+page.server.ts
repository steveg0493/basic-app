import { db } from "$lib/db/db";
import type { PageServerLoad } from "./$types";
import { DepartmentTable } from "$lib/db/schema";
import { asc } from "drizzle-orm";

export const load: PageServerLoad = async () => {
  const departments = await db
    .select()
    .from(DepartmentTable)
    .orderBy(asc(DepartmentTable.department_name));

  return {
    departments,
  };
};
