import { db } from "$lib/common/db.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const departments = await db.department.findMany();

  return {
    departments,
  };
};
