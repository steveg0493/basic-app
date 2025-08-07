import { db } from "$lib/common/db";
import type { PageServerLoad } from "./$types";
import { DepartmentTable } from "$lib/db/schema";

export const load: PageServerLoad = async () => {
  const departments = await db.select().from(DepartmentTable);

  return {
    departments,
  };
};
