import Db, { SQL_TYPES, type QueryParamArray } from "$lib/common/db_mssql";

interface IDepartment {
  department_id: number;
  department_name: string;
}
interface ValidationError {
  error: string;
}

export type { IDepartment, ValidationError };

export const Department = () => {
  const api = {
    generateObject: (row: any): IDepartment => {
      const object: IDepartment = {
        department_id: row.department_id,
        department_name: row.department_name,
      };
      return object;
    },
    getAll: async (): Promise<Array<IDepartment>> => {
      const results: IDepartment[] = [];
      const sql = `select * from data.department order by department_name`;
      const response = await Db().query(sql);
      for (const row of response) {
        const record = api.generateObject(row);
        results.push(record);
      }
      return results;
    },
    getSingle: async (id: number): Promise<IDepartment | void> => {
      const sql = `select * from data.department where department_id = @department_id `;
      const response = await Db().query(sql, [
        {
          direction: "input",
          name: "department_id",
          type: SQL_TYPES.Int,
          value: id,
        },
      ]);
      for (const row of response) {
        const record = api.generateObject(row);
        return record;
      }
    },
    update: async (
      record: IDepartment
    ): Promise<IDepartment | ValidationError> => {
      if (record.department_name.trim() === "") {
        return { error: "Please provide a department name" };
      }
      const sql = `update data.department 
      set department_name = @department_name 
      output inserted.*
      where department_id = @department_id`;
      const response = await Db().query(sql, [
        {
          direction: "input",
          name: "department_name",
          type: SQL_TYPES.VarChar(255),
          value: record.department_name,
        },
        {
          direction: "input",
          name: "department_id",
          type: SQL_TYPES.Int,
          value: record.department_id,
        },
      ]);

      if (!response || response.length === 0) {
        throw new Error("Unable to update record");
      }
      return api.generateObject(response[0]);
    },
    insert: async (
      record: IDepartment
    ): Promise<IDepartment | ValidationError> => {
      if (record.department_name.trim() === "") {
        return { error: "Please provide a department name" };
      }
      const sql = `insert into data.department (department_name) values (@department_name) output inserted.*`;
      const response = await Db().query(sql, [
        {
          direction: "input",
          name: "department_name",
          type: SQL_TYPES.VarChar(255),
          value: record.department_name,
        },
      ]);

      if (!response || response.length === 0) {
        throw new Error("Unable to update record");
      }
      return api.generateObject(response[0]);
    },
    delete: async (id: number): Promise<void> => {
      await Db().query(
        `delete from data.department where department_id = @department_id`,
        [
          {
            direction: "input",
            name: "department_id",
            type: SQL_TYPES.Int,
            value: id,
          },
        ]
      );
    },
  };
  return api;
};
