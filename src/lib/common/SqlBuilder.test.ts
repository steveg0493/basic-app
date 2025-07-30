import { describe, it, expect } from "vitest";
import { sqlBuilder } from "./SqlBuilder";

describe("SqlBuilder", () => {
  describe("Constructor", () => {
    it("should create a select builder", () => {
      const builder = sqlBuilder("select");
      expect(builder).toBeDefined();
    });

    it("should create an insert builder", () => {
      const builder = sqlBuilder("insert");
      expect(builder).toBeDefined();
    });

    it("should create an update builder", () => {
      const builder = sqlBuilder("update");
      expect(builder).toBeDefined();
    });

    it("should create a delete builder", () => {
      const builder = sqlBuilder("delete");
      expect(builder).toBeDefined();
    });
  });

  describe("Select Queries", () => {
    it("should build a simple select query", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .debug()
        .build();

      expect(query).toBe("SELECT id, name FROM users");
    });

    it("should build a select query with single column", () => {
      const query = sqlBuilder("select").select(["id"]).from("users").build();

      expect(query).toBe("SELECT id FROM users");
    });

    it("should build a select query with multiple tables", () => {
      const query = sqlBuilder("select")
        .select(["u.id", "u.name", "d.name as dept_name"])
        .from("users u")
        .from("departments d")
        .build();

      expect(query).toBe(
        "SELECT u.id, u.name, d.name as dept_name FROM users u, departments d"
      );
    });

    it("should build a select query with where clause", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .where("age", ">", "18")
        .build();

      expect(query).toBe("SELECT id, name FROM users WHERE age > 18");
    });

    it("should build a select query with multiple where clauses", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .where("age", ">", "18")
        .and("status", "=", "'active'")
        .build();

      expect(query).toBe(
        "SELECT id, name FROM users WHERE age > 18 AND status = 'active'"
      );
    });

    it("should build a select query with OR clause", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .where("status", "=", "'active'")
        .or("status", "=", "'pending'")
        .build();

      expect(query).toBe(
        "SELECT id, name FROM users WHERE status = 'active' OR status = 'pending'"
      );
    });

    it("should build a select query with complex where conditions", () => {
      const query = sqlBuilder("select")
        .select(["id", "name", "email"])
        .from("users")
        .where("age", ">=", "18")
        .and("email", "LIKE", "'%@example.com'")
        .or("status", "IN", "('active', 'pending')")
        .build();

      expect(query).toBe(
        "SELECT id, name, email FROM users WHERE age >= 18 AND email LIKE '%@example.com' OR status IN ('active', 'pending')"
      );
    });

    it("should build a select query with IS NULL condition", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .where("deleted_at", "IS NULL", "")
        .build();
      expect(query).toBe("SELECT id, name FROM users WHERE deleted_at IS NULL");
    });

    it("should build a select query with IS NOT NULL condition", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .where("email", "IS NOT NULL", "")
        .build();

      expect(query).toBe("SELECT id, name FROM users WHERE email IS NOT NULL");
    });

    it("should build a select query with BETWEEN condition", () => {
      const query = sqlBuilder("select")
        .select(["id", "name", "salary"])
        .from("employees")
        .where("salary", "BETWEEN", "50000 AND 100000")
        .build();

      expect(query).toBe(
        "SELECT id, name, salary FROM employees WHERE salary BETWEEN 50000 AND 100000"
      );
    });

    it("should build a select query with NOT LIKE condition", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .where("email", "NOT LIKE", "'%@spam.com'")
        .build();

      expect(query).toBe(
        "SELECT id, name FROM users WHERE email NOT LIKE '%@spam.com'"
      );
    });
  });

  describe("Error Handling", () => {
    it("should throw error when select is called on non-select builder", () => {
      expect(() => {
        sqlBuilder("insert").select(["id"]);
      }).toThrow("Select method can only be used for select queries");
    });

    it("should throw error when from is called on insert builder", () => {
      expect(() => {
        sqlBuilder("insert").from("users");
      }).toThrow("From method can only be used for select and update queries");
    });

    it("should throw error when from is called on delete builder", () => {
      expect(() => {
        sqlBuilder("delete").from("users");
      }).toThrow("From method can only be used for select and update queries");
    });

    it("should throw error when where is called on insert builder", () => {
      expect(() => {
        sqlBuilder("insert").where("id", "=", "1");
      }).toThrow(
        "Where method can only be used for select, update and delete queries"
      );
    });

    it("should throw error when and is called on insert builder", () => {
      expect(() => {
        sqlBuilder("insert").and("id", "=", "1");
      }).toThrow(
        "Where method can only be used for select, update and delete queries"
      );
    });

    it("should throw error when or is called on insert builder", () => {
      expect(() => {
        sqlBuilder("insert").or("id", "=", "1");
      }).toThrow(
        "Where method can only be used for select, update and delete queries"
      );
    });
  });

  describe("Method Chaining", () => {
    it("should support method chaining for select queries", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .where("age", ">", "18")
        .and("status", "=", "'active'")
        .or("role", "=", "'admin'")
        .build();

      expect(query).toBe(
        "SELECT id, name FROM users WHERE age > 18 AND status = 'active' OR role = 'admin'"
      );
    });

    it("should return the same instance for chaining", () => {
      const builder = sqlBuilder("select");
      const result1 = builder.select(["id"]);
      const result2 = result1.from("users");
      const result3 = result2.where("id", "=", "1");

      expect(result1).toBe(builder);
      expect(result2).toBe(builder);
      expect(result3).toBe(builder);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty columns array", () => {
      const query = sqlBuilder("select").select([]).from("users").build();

      expect(query).toBe("SELECT  FROM users");
    });

    it("should handle empty where clauses", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .build();

      expect(query).toBe("SELECT id, name FROM users");
    });

    it("should handle multiple from calls", () => {
      const query = sqlBuilder("select")
        .select(["u.id", "d.name"])
        .from("users u")
        .from("departments d")
        .from("roles r")
        .build();

      expect(query).toBe(
        "SELECT u.id, d.name FROM users u, departments d, roles r"
      );
    });

    it("should handle where clause with empty value", () => {
      const query = sqlBuilder("select")
        .select(["id", "name"])
        .from("users")
        .where("deleted_at", "IS NULL", "")
        .build();

      expect(query).toBe("SELECT id, name FROM users WHERE deleted_at IS NULL");
    });
  });

  describe("Unsupported Query Types", () => {
    it("should return empty string for insert queries", () => {
      const query = sqlBuilder("insert").build();
      expect(query).toBe("");
    });

    it("should return empty string for update queries", () => {
      const query = sqlBuilder("update").build();
      expect(query).toBe("");
    });

    it("should return empty string for delete queries", () => {
      const query = sqlBuilder("delete").build();
      expect(query).toBe("");
    });
  });
});
