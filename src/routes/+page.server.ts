import { db } from "$lib/db.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const departments = await db.department.findMany();

  return {
    departments,
  };
};
