import { db } from "../lib/db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function migrate() {
  try {
    console.log("🔄 Running database migrations...");
    
    // Read the latest migration file
    const migrationsDir = path.join(process.cwd(), "drizzle");
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));
    
    if (files.length === 0) {
      console.log("⚠️  No migration files found");
      return;
    }
    
    // Get the latest migration
    const latestMigration = files.sort().reverse()[0];
    const migrationPath = path.join(migrationsDir, latestMigration);
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
    
    console.log(`📄 Applying migration: ${latestMigration}`);
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      await db.execute(sql.raw(statement));
    }
    
    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
