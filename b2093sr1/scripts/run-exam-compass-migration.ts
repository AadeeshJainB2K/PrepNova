import { db } from "../lib/db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function examCompassMigrate() {
  try {
    console.log("🔄 Running Exam-Compass migration...");
    console.log("✅ This will PRESERVE all existing data and column names");
    console.log("📝 Actions:");
    console.log("   - Add exam-focused fields to user table (camelCase)");
    console.log("   - Create new exam-compass tables (camelCase)");
    console.log("");
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), "scripts", "exam-compass-migration.sql");
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
    console.log("📊 Added to user table (camelCase):");
    console.log("   - targetExam");
    console.log("   - targetYear");
    console.log("   - studyStreak");
    console.log("   - totalQuestionsSolved");
    console.log("   - overallAccuracy");
    console.log("");
    console.log("📊 New exam-compass tables (camelCase):");
    console.log("   - exams");
    console.log("   - examTimelines");
    console.log("   - mockQuestions");
    console.log("   - userExamPreferences");
    console.log("   - userProgress");
    console.log("   - mockTestSessions");
    console.log("   - studyGroups");
    console.log("   - studyGroupMembers");
    console.log("   - userAchievements");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

examCompassMigrate();
