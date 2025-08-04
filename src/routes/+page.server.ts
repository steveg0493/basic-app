import { db } from "$lib/db.server";
import type { Department } from "$lib/types/Department";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const departments: Department[] = await db.department.findMany();

  return {
    departments,
  };
};
