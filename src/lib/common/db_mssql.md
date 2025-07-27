# Basic App - MSSQL Database Integration

This application provides a comprehensive MSSQL database integration with TypeScript support, featuring predefined SQL data types and a singleton database connection pattern.

## SQL Data Types

The application exports a `SQL_TYPES` object containing all commonly used MSSQL data types for easy parameter definition and type safety.

### Available SQL Types

| Type            | Description                      | Usage Example                  |
| --------------- | -------------------------------- | ------------------------------ |
| `DateTime`      | Date and time values             | `SQL_TYPES.DateTime`           |
| `Int`           | 32-bit integer                   | `SQL_TYPES.Int`                |
| `VarChar`       | Variable-length character string | `SQL_TYPES.VarChar(50)`        |
| `Float`         | Floating-point number            | `SQL_TYPES.Float`              |
| `Decimal`       | Fixed-precision decimal          | `SQL_TYPES.Decimal(10, 2)`     |
| `BigInt`        | 64-bit integer                   | `SQL_TYPES.BigInt`             |
| `SmallDateTime` | Small date and time              | `SQL_TYPES.SmallDateTime`      |
| `SmallInt`      | 16-bit integer                   | `SQL_TYPES.SmallInt`           |
| `TinyInt`       | 8-bit integer                    | `SQL_TYPES.TinyInt`            |
| `Real`          | Single-precision float           | `SQL_TYPES.Real`               |
| `Bit`           | Boolean value (0 or 1)           | `SQL_TYPES.Bit`                |
| `VarBinary`     | Variable-length binary           | `SQL_TYPES.VarBinary(100)`     |
| `Image`         | Large binary data                | `SQL_TYPES.Image`              |
| `Xml`           | XML data                         | `SQL_TYPES.Xml`                |
| `Char`          | Fixed-length character           | `SQL_TYPES.Char(10)`           |
| `NChar`         | Unicode fixed-length character   | `SQL_TYPES.NChar(10)`          |
| `NText`         | Unicode large text               | `SQL_TYPES.NText`              |
| `TVP`           | Table-Valued Parameter           | `SQL_TYPES.TVP(SQL_TYPES.Int)` |

## Usage Examples

### Importing SQL Types

```typescript
import { SQL_TYPES } from "$lib/common/db_mssql";
```

### Basic Parameter Definition

```typescript
// Define parameters for a prepared statement
const params = [
  { direction: "input", name: "userId", type: SQL_TYPES.Int, value: 123 },
  {
    direction: "input",
    name: "userName",
    type: SQL_TYPES.VarChar(50),
    value: "John Doe",
  },
  {
    direction: "input",
    name: "createdDate",
    type: SQL_TYPES.DateTime,
    value: new Date(),
  },
  { direction: "input", name: "isActive", type: SQL_TYPES.Bit, value: true },
];
```

### Using with Prepared Statements

```typescript
import MSSQL from "$lib/common/db_mssql";

const db = MSSQL();

// Example query with input parameters
const sql = "SELECT * FROM Users WHERE Id = @param1 AND IsActive = @param2";
const params = [
  { direction: "input", name: "param1", type: SQL_TYPES.Int, value: 123 },
  { direction: "input", name: "param2", type: SQL_TYPES.Bit, value: true },
];

const result = await db.query(sql, params);
```

### Working with Different Data Types

```typescript
// Integer parameters
const userId = {
  direction: "input",
  name: "userId",
  type: SQL_TYPES.Int,
  value: 123,
};
const age = { direction: "input", name: "age", type: SQL_TYPES.Int, value: 25 };

// String parameters
const name = {
  direction: "input",
  name: "name",
  type: SQL_TYPES.VarChar(100),
  value: "John Doe",
};
const email = {
  direction: "input",
  name: "email",
  type: SQL_TYPES.VarChar(255),
  value: "john@example.com",
};

// Date parameters
const birthDate = {
  direction: "input",
  name: "birthDate",
  type: SQL_TYPES.DateTime,
  value: new Date("1990-01-01"),
};
const lastLogin = {
  direction: "input",
  name: "lastLogin",
  type: SQL_TYPES.DateTime,
  value: new Date(),
};

// Boolean parameters
const isActive = {
  direction: "input",
  name: "isActive",
  type: SQL_TYPES.Bit,
  value: true,
};
const isVerified = {
  direction: "input",
  name: "isVerified",
  type: SQL_TYPES.Bit,
  value: false,
};

// Decimal parameters
const price = {
  direction: "input",
  name: "price",
  type: SQL_TYPES.Decimal(10, 2),
  value: 99.99,
};
const discount = {
  direction: "input",
  name: "discount",
  type: SQL_TYPES.Decimal(5, 2),
  value: 0.15,
};
```

### Input and Output Parameters

```typescript
// Stored procedure with both input and output parameters
const sql = "EXEC GetUserInfo @userId, @userName OUTPUT, @userEmail OUTPUT";
const params = [
  { direction: "input", name: "userId", type: SQL_TYPES.Int, value: 123 },
  {
    direction: "output",
    name: "userName",
    type: SQL_TYPES.VarChar(100),
    value: null,
  },
  {
    direction: "output",
    name: "userEmail",
    type: SQL_TYPES.VarChar(255),
    value: null,
  },
];

const result = await db.query(sql, params);
// Output parameters will be available in the result object
```

### Table-Valued Parameters (TVP)

```typescript
// Define a TVP for bulk operations
const userIds = [1, 2, 3, 4, 5];
const tvpParam = {
  direction: "input",
  name: "userIds",
  type: SQL_TYPES.TVP(SQL_TYPES.Int),
  value: userIds,
};

// Use in bulk operations
const bulkSql = "EXEC BulkUpdateUsers @param1";
const result = await db.query(bulkSql, [tvpParam]);
```

### Creating Parameter Templates

```typescript
// Create reusable parameter templates
const createUserParams = (userData: any) => [
  {
    direction: "input",
    name: "name",
    type: SQL_TYPES.VarChar(100),
    value: userData.name,
  },
  {
    direction: "input",
    name: "email",
    type: SQL_TYPES.VarChar(255),
    value: userData.email,
  },
  { direction: "input", name: "age", type: SQL_TYPES.Int, value: userData.age },
  {
    direction: "input",
    name: "isActive",
    type: SQL_TYPES.Bit,
    value: userData.isActive,
  },
  {
    direction: "input",
    name: "createdDate",
    type: SQL_TYPES.DateTime,
    value: new Date(),
  },
];

// Usage
const userData = {
  name: "Jane Smith",
  email: "jane@example.com",
  age: 30,
  isActive: true,
};

const params = createUserParams(userData);
const sql =
  "INSERT INTO Users (Name, Email, Age, IsActive, CreatedDate) VALUES (@param1, @param2, @param3, @param4, @param5)";
const result = await db.query(sql, params);
```

### Stored Procedure with Output Parameters

```typescript
// Example: Stored procedure that returns user count and last login date
const sql = "EXEC GetUserStats @totalUsers OUTPUT, @lastLoginDate OUTPUT";
const params = [
  { direction: "output", name: "totalUsers", type: SQL_TYPES.Int, value: null },
  {
    direction: "output",
    name: "lastLoginDate",
    type: SQL_TYPES.DateTime,
    value: null,
  },
];

const result = await db.query(sql, params);
// Access output parameters from the result
console.log(`Total users: ${result.totalUsers}`);
console.log(`Last login: ${result.lastLoginDate}`);
```

## Database Connection

The application uses a singleton pattern for database connections to ensure efficient resource usage:

```typescript
import { DBInstance } from "$lib/common/db_mssql";

// Get database instance (automatically manages connection)
const dbInstance = await DBInstance.getInstance();
const connection = await dbInstance.getContext();
```

## Environment Variables

The following environment variables are required for database connection:

- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_SERVER`: Database server address
- `DB_DATABASE`: Database name

## Type Safety

The application provides TypeScript types for enhanced development experience:

```typescript
import type { QueryParam, QueryParamArray } from "$lib/common/db_mssql";

// Define typed parameters
const typedParams: QueryParamArray = [
  { direction: "input", name: "param1", type: SQL_TYPES.Int, value: 123 },
  {
    direction: "input",
    name: "param2",
    type: SQL_TYPES.VarChar(100),
    value: "example",
  },
];

// QueryParam type structure
type QueryParam = {
  direction: "input" | "output"; // Parameter direction (input or output)
  name: string; // Parameter name (e.g., "userId", "userName")
  type: SqlDataType; // SQL data type from SQL_TYPES
  value: any; // Parameter value (null for output parameters)
};
```

## Error Handling

The database operations include proper error handling:

```typescript
try {
  const params = [
    { direction: "input", name: "userId", type: SQL_TYPES.Int, value: 123 },
  ];
  const result = await db.query(sql, params);
  return result;
} catch (error) {
  console.error("Database query failed:", error);
  throw new Error("Unable to execute database query");
}
```

## Best Practices

1. **Use Prepared Statements**: Always use the query method with parameters to prevent SQL injection
2. **Type Safety**: Leverage TypeScript types for parameter definitions
3. **Parameter Direction**: Always specify the correct direction ("input" or "output") for each parameter
4. **Parameter Naming**: Use descriptive parameter names for better code readability
5. **Value Validation**: Validate parameter values before executing queries
6. **Output Parameters**: Set output parameter values to `null` initially
7. **Connection Management**: The singleton pattern handles connections automatically
8. **Error Handling**: Always wrap database operations in try-catch blocks
9. **Parameter Templates**: Create reusable parameter templates for common operations

## File Structure

```
src/lib/common/
├── db_mssql.ts          # Main database module with SQL_TYPES
└── db_postgresql.ts     # PostgreSQL alternative (if needed)
```

## Dependencies

- `mssql`: Microsoft SQL Server client for Node.js
- TypeScript support for type safety
- Environment variable management for configuration
