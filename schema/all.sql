-- Manually create your database first then run the following on your database

CREATE SCHEMA IF NOT EXISTS data AUTHORIZATION slate_apps;

CREATE TABLE data.department (
    department_id SERIAL PRIMARY KEY,
    department_name text NOT NULL
);

-- Allows user to access tables
GRANT USAGE ON SCHEMA data to slate_apps;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA data TO GROUP slate_apps;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA data TO GROUP slate_apps;