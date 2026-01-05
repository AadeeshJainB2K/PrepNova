import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Fallback for build time when DATABASE_URL might not be set
const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

// Disable prefetch as it's not supported for "Transaction" pool mode
// Configure connection pool to prevent "too many clients" error
const client = postgres(connectionString, { 
  prepare: false,
  max: 10, // Maximum 10 connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
});

export const db = drizzle(client, { schema });
