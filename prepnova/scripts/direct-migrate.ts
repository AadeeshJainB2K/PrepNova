import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

// Direct connection - no caching
const DATABASE_URL = "postgresql://abhajain:2010@localhost:5432/prepnova";

async function directMigrate() {
  const sql = postgres(DATABASE_URL);
  
  try {
    console.log("🔄 Running Exam-Compass migration (Direct Connection)...");
    console.log(`📍 Database: ${DATABASE_URL.split('@')[1]}\n`);
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), "scripts", "exam-compass-migration.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
    
    console.log("📄 Applying migration...\n");
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
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
        } else if (statement.includes("CREATE INDEX")) {
          const match = statement.match(/CREATE INDEX.*"(\w+)"/);
          if (match) {
            console.log(`   ✓ Created index: ${match[1]}`);
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("already exists")) {
          skipCount++;
        } else {
          console.error(`⚠️  Error: ${errorMessage.substring(0, 100)}`);
        }
      }
    }
    
    console.log(`\n✅ Migration completed!`);
    console.log(`   - Executed: ${successCount} statements`);
    console.log(`   - Skipped: ${skipCount} (already exist)`);
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await sql.end();
    process.exit(1);
  }
}

directMigrate();
