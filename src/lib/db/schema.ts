import { pgSchema, serial, text } from "drizzle-orm/pg-core";

export const dataSchema = pgSchema("data");

export const DepartmentTable = dataSchema.table("department", {
  department_id: serial("department_id").primaryKey(),
  department_name: text("department_name").notNull(),
});
