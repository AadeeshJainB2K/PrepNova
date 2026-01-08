import postgres from "postgres";

const DATABASE_URL = "postgresql://abhajain:2010@localhost:5432/b2093sr1";

async function verifyDirect() {
  const sql = postgres(DATABASE_URL);
  
  try {
    console.log("🔍 Verifying database tables...\n");
    
    // Get all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log("📊 Existing tables in database:");
    console.log("================================");
    
    tables.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    console.log(`\nTotal: ${tables.length} tables\n`);
    
    // Check for exam-compass specific tables
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
    
    examTables.forEach(tableName => {
      const exists = tables.some(row => row.table_name === tableName);
      console.log(`${exists ? '✓' : '✗'} ${tableName}`);
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
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Verification failed:", error);
    await sql.end();
    process.exit(1);
  }
}

verifyDirect();
