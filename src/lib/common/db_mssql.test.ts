import sql from "mssql";
import { DBInstance, SQL_TYPES } from "$lib/common/db_mssql";

import { describe, it, expect } from "vitest";

describe("query", async () => {
  let department_id: number;
  let department_name: string;

  it("should insert a new department", async () => {
    const dbContext = await (await DBInstance.getInstance()).getContext();

    const sqlText = `insert into data.department (department_name) output inserted.* values (@department_name)`;
    const result = await dbContext
      .request()
      .input("department_name", SQL_TYPES.VarChar(255), "Test")
      .query(sqlText);
    department_id = result.recordset[0].department_id;
    department_name = result.recordset[0].department_name;
    expect(result.recordset[0].department_name).toBe("Test");
  });

  it("should return a result with an id of the inserted department", async () => {
    const dbContext = await (await DBInstance.getInstance()).getContext();

    const sqlText = `select department_id, department_name from data.department where department_id = @department_id`;
    const result = await dbContext
      .request()
      .input("department_id", SQL_TYPES.Int, department_id)
      .query(sqlText);
    expect(result.recordset[0].department_id).toBe(department_id);
  });

  it("should return a result with a department name of the inserted department", async () => {
    const dbContext = await (await DBInstance.getInstance()).getContext();

    const sqlText = `select department_id, department_name from data.department where department_name = @department_name`;
    const result = await dbContext
      .request()
      .input("department_name", SQL_TYPES.VarChar(255), department_name)
      .query(sqlText);
    expect(result.recordset[0].department_name).toBe(department_name);
  });

  it("should update a department", async () => {
    const dbContext = await (await DBInstance.getInstance()).getContext();

    const sqlText = `update data.department set department_name = @department_name output inserted.* where department_id = @department_id`;
    const result = await dbContext
      .request()
      .input("department_name", SQL_TYPES.VarChar(255), "Test123")
      .input("department_id", SQL_TYPES.Int, department_id)
      .query(sqlText);
    expect(result.recordset[0].department_name).toBe("Test123");
  });

  it("should delete a department", async () => {
    const dbContext = await (await DBInstance.getInstance()).getContext();

    const sqlText = `delete from data.department where department_id = @department_id`;
    const result = await dbContext
      .request()
      .input("department_id", SQL_TYPES.Int, department_id)
      .query(sqlText);
    expect(result.rowsAffected[0]).toBe(1);
  });
});
