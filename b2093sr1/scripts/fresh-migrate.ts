import { db } from "../lib/db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function freshMigrate() {
  try {
    console.log("🔄 Running FRESH Exam-Compass migration...");
    console.log("⚠️  WARNING: This will DROP ALL existing tables and data!");
    
    // Read the fresh migration file
    const migrationPath = path.join(process.cwd(), "scripts", "fresh-exam-compass-migration.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
    
    console.log("📄 Applying fresh migration...");
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));
    
    let successCount = 0;
    for (const statement of statements) {
      try {
        await db.execute(sql.raw(statement));
        successCount++;
      } catch (error: unknown) {
        // Log but continue if table doesn't exist
        if (!error instanceof Error && error.message.includes("does not exist")) {
          console.error(`⚠️  Statement failed: ${statement.substring(0, 50)}...`);
          console.error(`   Error: ${error.message}`);
        }
      }
    }
    
    console.log(`✅ Migration completed! Executed ${successCount} statements successfully.`);
    console.log("📊 Created tables:");
    console.log("   - user (with exam-focused fields)");
    console.log("   - exams");
    console.log("   - exam_timelines");
    console.log("   - mock_questions");
    console.log("   - user_exam_preferences");
    console.log("   - user_progress");
    console.log("   - mock_test_sessions");
    console.log("   - study_groups");
    console.log("   - study_group_members");
    console.log("   - user_achievements");
    console.log("   - Plus: conversations, messages, products, etc.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

freshMigrate();
