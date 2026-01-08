import postgres from "postgres";

const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

async function verifyNeon() {
  if (!NEON_DATABASE_URL || NEON_DATABASE_URL.includes('localhost')) {
    console.error("❌ Please set NEON_DATABASE_URL environment variable");
    console.log("   Example: export NEON_DATABASE_URL='postgresql://...'");
    process.exit(1);
  }

  const sql = postgres(NEON_DATABASE_URL);

  try {
    console.log("🔍 Verifying Neon database...\n");
    console.log(`📍 Host: ${NEON_DATABASE_URL.split('@')[1]?.split('/')[0]}\n`);

    // Get all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    console.log("📊 All tables in database:");
    console.log("================================");
    tables.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    console.log(`\nTotal: ${tables.length} tables\n`);

    // Check exam-compass tables
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

    console.log("✅ Exam-Compass Tables Status:");
    console.log("================================");
    let allExist = true;
    examTables.forEach(tableName => {
      const exists = tables.some(row => row.table_name === tableName);
      console.log(`${exists ? '✓' : '✗'} ${tableName}`);
      if (!exists) allExist = false;
    });

    // Check user table columns
    console.log("\n📋 User table columns:");
    console.log("================================");
    const userColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      ORDER BY ordinal_position;
    `;

    userColumns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });

    // Check data counts
    console.log("\n📈 Data counts:");
    console.log("================================");
    
    const examCount = await sql`SELECT COUNT(*) as count FROM exams`;
    console.log(`- Exams: ${examCount[0].count}`);
    
    const timelineCount = await sql`SELECT COUNT(*) as count FROM "examTimelines"`;
    console.log(`- Timeline events: ${timelineCount[0].count}`);
    
    const questionCount = await sql`SELECT COUNT(*) as count FROM "mockQuestions"`;
    console.log(`- Mock questions: ${questionCount[0].count}`);

    if (allExist) {
      console.log("\n✅ Neon database is fully configured!");
    } else {
      console.log("\n⚠️  Some tables are missing. Run migration script.");
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Verification failed:", error);
    await sql.end();
    process.exit(1);
  }
}

verifyNeon();
