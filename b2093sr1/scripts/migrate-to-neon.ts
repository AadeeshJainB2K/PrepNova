import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Get Neon DATABASE_URL from environment or prompt
const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

async function promptForNeonUrl(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\n📝 Enter your Neon DATABASE_URL: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function migrateToNeon() {
  try {
    console.log("🚀 Neon Database Migration Tool");
    console.log("================================\n");

    let databaseUrl = NEON_DATABASE_URL;

    if (!databaseUrl || databaseUrl.includes('localhost') || databaseUrl.includes('placeholder')) {
      console.log("⚠️  No Neon DATABASE_URL found in environment");
      console.log("💡 You can set it with: export NEON_DATABASE_URL='your-neon-url'");
      databaseUrl = await promptForNeonUrl();
    }

    if (!databaseUrl || databaseUrl.includes('localhost')) {
      console.error("❌ Invalid Neon URL. Please provide a valid Neon connection string.");
      process.exit(1);
    }

    // Verify it's a Neon URL
    if (!databaseUrl.includes('neon.tech')) {
      console.warn("⚠️  Warning: This doesn't look like a Neon URL");
      console.log("   Neon URLs typically contain 'neon.tech'");
      console.log("   Proceeding anyway...\n");
    }

    const sql = postgres(databaseUrl);

    console.log("✅ Connected to Neon database");
    console.log(`📍 Host: ${databaseUrl.split('@')[1]?.split('/')[0]}\n`);

    // Read the migration file
    const migrationPath = path.join(process.cwd(), "scripts", "exam-compass-migration.sql");
    
    if (!fs.existsSync(migrationPath)) {
      console.error("❌ Migration file not found:", migrationPath);
      await sql.end();
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("📄 Applying Exam-Compass migration to Neon...\n");

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

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
      } catch (error: any) {
        // Skip if already exists
        if (error.message?.includes("already exists")) {
          skipCount++;
        } else {
          errorCount++;
          console.error(`   ⚠️  Error: ${error.message?.substring(0, 100)}`);
        }
      }
    }

    console.log(`\n✅ Neon migration completed!`);
    console.log(`   - Executed: ${successCount} statements`);
    console.log(`   - Skipped: ${skipCount} (already exist)`);
    console.log(`   - Errors: ${errorCount}`);

    // Verify tables were created
    console.log("\n🔍 Verifying tables...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    const examTables = [
      'exams',
      'examTimelines',
      'mockQuestions',
      'userExamPreferences',
      'userProgress',
      'mockTestSessions',
      'studyGroups',
      'studyGroupMembers',
      'userAchievements'
    ];

    console.log("\n📊 Exam-Compass Tables:");
    examTables.forEach(tableName => {
      const exists = tables.some(row => row.table_name === tableName);
      console.log(`   ${exists ? '✓' : '✗'} ${tableName}`);
    });

    console.log(`\n✅ Total tables in Neon: ${tables.length}`);
    
    console.log("\n🎉 Neon database is ready!");
    console.log("\n📝 Next steps:");
    console.log("   1. Run seed script: NEON_DATABASE_URL='your-url' npx tsx scripts/seed-exams.ts");
    console.log("   2. Update production environment variables");
    console.log("   3. Deploy your application");

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateToNeon();
