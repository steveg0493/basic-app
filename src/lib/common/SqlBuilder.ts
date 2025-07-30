type SQLOperator =
  | "="
  | ">"
  | "<"
  | ">="
  | "<="
  | "!="
  | "LIKE"
  | "IN"
  | "NOT IN"
  | "NOT LIKE"
  | "BETWEEN"
  | "NOT BETWEEN"
  | "IS NULL"
  | "IS NOT NULL";

export type SQLType = "select" | "insert" | "update" | "delete";

export class SqlBuilder {
  private _type: "select" | "insert" | "update" | "delete";
  private columns: string[] = [];
  private tables: string[] = [];
  private whereClauses: string[] = [];
  private _values: string[] = [];

  constructor(type: SQLType) {
    this._type = type;
  }

  public select = (columns: string[]): SqlBuilder => {
    if (this._type !== "select") {
      throw new Error("Select method can only be used for select queries");
    }
    this.columns = columns;
    return this;
  };

  public from = (table: string): SqlBuilder => {
    if (this._type !== "select" && this._type !== "update") {
      throw new Error(
        "From method can only be used for select and update queries"
      );
    }
    this.tables.push(table);
    return this;
  };

  public where = (
    field: string,
    operator: SQLOperator,
    value: string = ""
  ): SqlBuilder => {
    if (
      this._type !== "select" &&
      this._type !== "update" &&
      this._type !== "delete"
    ) {
      throw new Error(
        "Where method can only be used for select, update and delete queries"
      );
    }
    this.whereClauses.push(`WHERE ${field} ${operator} ${value}`);
    return this;
  };

  public and = (
    field: string,
    operator: SQLOperator,
    value: string = ""
  ): SqlBuilder => {
    if (
      this._type !== "select" &&
      this._type !== "update" &&
      this._type !== "delete"
    ) {
      throw new Error(
        "Where method can only be used for select, update and delete queries"
      );
    }
    this.whereClauses.push(`AND ${field} ${operator} ${value}`);
    return this;
  };

  public or = (
    field: string,
    operator: SQLOperator,
    value: string = ""
  ): SqlBuilder => {
    if (
      this._type !== "select" &&
      this._type !== "update" &&
      this._type !== "delete"
    ) {
      throw new Error(
        "Where method can only be used for select, update and delete queries"
      );
    }
    this.whereClauses.push(`OR ${field} ${operator} ${value}`);
    return this;
  };

  public debug = (): SqlBuilder => {
    console.log(this._type);
    console.log(this.columns);
    console.log(this.tables);
    console.log(this.whereClauses);
    console.log(this._values);
    return this;
  };

  public build = (): string => {
    let _sql = "";
    switch (this._type) {
      case "select":
        _sql = `SELECT ${this.columns.join(", ")}`;
        if (this.tables.length > 0) {
          _sql += ` FROM ${this.tables.join(", ")}`;
        }
        if (this.whereClauses.length > 0) {
          _sql += ` ${this.whereClauses.join(" ")}`;
        }
        return _sql.trim();

      //   case "insert":
      //     return `INSERT INTO ${this.tables.join(", ")} (${this.columns.join(", ")}) VALUES (${this.values.join(", ")})`;
      //   case "update":
      //     return `UPDATE ${this.tables.join(", ")} SET ${this.columns.join(", ")} = ${this.values.join(", ")} ${
      //       this.whereClauses.length > 0
      //         ? `WHERE ${this.whereClauses.join(" AND ")}`
      //         : ""
      //     }`;
      //   case "update":
      //     return `UPDATE ${this.tables.join(", ")} SET ${this.columns.join(", ")} = ${this.values.join(", ")} ${
      //       this.whereClauses.length > 0
      //         ? `WHERE ${this.whereClauses.join(" AND ")}`
      //         : ""
      //     }`;
      //   case "delete":
      //     return `DELETE FROM ${this.tables.join(", ")} ${
      //       this.whereClauses.length > 0
      //         ? `WHERE ${this.whereClauses.join(" AND ")}`
      //         : ""
      //     }`;
    }
    return _sql;
  };
}

export function sqlBuilder(type: "select" | "insert" | "update" | "delete") {
  return new SqlBuilder(type);
}
