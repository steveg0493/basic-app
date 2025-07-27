import sql from "mssql";
import type { ConnectionPool as ConnectionPoolType } from "mssql";

import {
  DB_USER,
  DB_PASSWORD,
  DB_SERVER,
  DB_DATABASE,
} from "$env/static/private";

type SqlDataType =
  | sql.ISqlTypeFactoryWithNoParams
  | sql.ISqlTypeFactoryWithLength
  | sql.ISqlTypeFactoryWithPrecisionScale
  | sql.ISqlTypeFactoryWithScale
  | sql.ISqlTypeFactoryWithTvpType
  | sql.ISqlTypeWithLength
  | sql.ISqlTypeWithPrecisionScale
  | sql.ISqlTypeWithTvpType;

// Export individual SQL data types
export const SQL_TYPES = {
  DateTime: sql.DateTime,
  Int: sql.Int,
  VarChar: sql.VarChar,
  Float: sql.Float,
  Decimal: sql.Decimal,
  BigInt: sql.BigInt,
  SmallDateTime: sql.SmallDateTime,
  SmallInt: sql.SmallInt,
  TinyInt: sql.TinyInt,
  Real: sql.Real,
  Bit: sql.Bit,
  VarBinary: sql.VarBinary,
  Image: sql.Image,
  Xml: sql.Xml,
  Char: sql.Char,
  NChar: sql.NChar,
  NText: sql.NText,
  TVP: sql.TVP,
};

type QueryParmDirection = "input" | "output";

export type QueryParam = {
  direction: QueryParmDirection;
  name: string;
  type: SqlDataType;
  value: any;
};

export type QueryParamArray = QueryParam[];

const MSSQL = () => {
  const api = {
    checkConnection: async (): Promise<ConnectionPoolType> => {
      return await (await DBInstance.getInstance()).getContext();
    },
    query: async (
      sqlText: string,
      params: QueryParamArray = []
    ): Promise<any> => {
      // Get the database context
      const dbContext = await (await DBInstance.getInstance()).getContext();
      if (dbContext) {
        // Create a prepared statement
        const ps = new sql.PreparedStatement(dbContext);
        // Add parameter definitions to the prepared statement
        params.forEach((param, i) => {
          if (param.direction === "input") {
            ps.input(`${param.name}`, param.type);
          } else if (param.direction === "output") {
            ps.output(`${param.name}`, param.type);
          }
        });
        // Create a parameter values array. Each object has a single parameter name and value
        const paramValues = params.map((param, i) => ({
          [`${param.name}`]: param.value,
        }));
        // Prepare the statement
        await ps.prepare(sqlText);
        // Execute the statement
        try {
          const result = await ps.execute(paramValues);
          // Return the result
          return result.recordset;
        } catch (err) {
          console.log(err);
          throw new Error("Unable to execute statement");
        }
      }
    },
  };
  return api;
};

export default MSSQL;

// Singleton pattern - used to connect to the database ONCE throughout the entire life of the app
export class DBInstance {
  private static dbContext: ConnectionPoolType;
  private static instance: DBInstance;
  private async initialize() {
    try {
      DBInstance.dbContext = await sql.connect({
        user: DB_USER,
        password: DB_PASSWORD,
        server: DB_SERVER,
        database: DB_DATABASE,
        options: {
          encrypt: true,
          trustServerCertificate: true,
          enableArithAbort: true,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error("Unable to connect to database");
    }
  }
  public static getInstance = async (): Promise<DBInstance> => {
    if (!DBInstance.instance) {
      DBInstance.instance = new DBInstance();
      await DBInstance.instance.initialize();
    }
    return DBInstance.instance;
  };
  public getContext = async (): Promise<ConnectionPoolType> => {
    return DBInstance.dbContext;
  };
}
