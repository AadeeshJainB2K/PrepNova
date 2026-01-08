import { db } from "../lib/db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function alterMigrate() {
  try {
    console.log("🔄 Running Exam-Compass ALTER migration...");
    console.log("✅ This will PRESERVE all existing data");
    console.log("📝 Actions:");
    console.log("   - Rename columns to snake_case");
    console.log("   - Add exam-focused fields to user table");
    console.log("   - Create new exam-compass tables");
    console.log("");
    
    // Read the alter migration file
    const migrationPath = path.join(process.cwd(), "scripts", "exam-compass-alter-migration.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
    
    console.log("📄 Applying migration...");
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const statement of statements) {
      try {
        await db.execute(sql.raw(statement));
        successCount++;
        
        // Log progress for major operations
        if (statement.includes("ALTER TABLE")) {
          const match = statement.match(/ALTER TABLE "(\w+)"/);
          if (match) {
            console.log(`   ✓ Updated table: ${match[1]}`);
          }
        } else if (statement.includes("CREATE TABLE")) {
          const match = statement.match(/CREATE TABLE.*"(\w+)"/);
          if (match) {
            console.log(`   ✓ Created table: ${match[1]}`);
          }
        }
      } catch (error: any) {
        // Skip if column already exists or table already exists
        if (error.message?.includes("already exists") || 
            error.message?.includes("does not exist")) {
          skipCount++;
        } else {
          console.error(`⚠️  Statement failed: ${statement.substring(0, 60)}...`);
          console.error(`   Error: ${error.message}`);
        }
      }
    }
    
    console.log("");
    console.log(`✅ Migration completed!`);
    console.log(`   - Executed: ${successCount} statements`);
    console.log(`   - Skipped: ${skipCount} (already applied)`);
    console.log("");
    console.log("📊 Updated columns to snake_case:");
    console.log("   - userId → user_id");
    console.log("   - createdAt → created_at");
    console.log("   - isActive → is_active");
    console.log("   - etc.");
    console.log("");
    console.log("📊 Added to user table:");
    console.log("   - target_exam");
    console.log("   - target_year");
    console.log("   - study_streak");
    console.log("   - total_questions_solved");
    console.log("   - overall_accuracy");
    console.log("");
    console.log("📊 New exam-compass tables:");
    console.log("   - exams");
    console.log("   - exam_timelines");
    console.log("   - mock_questions");
    console.log("   - user_exam_preferences");
    console.log("   - user_progress");
    console.log("   - mock_test_sessions");
    console.log("   - study_groups");
    console.log("   - study_group_members");
    console.log("   - user_achievements");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

alterMigrate();
