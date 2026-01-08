import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function verifyTables() {
  try {
    console.log("🔍 Verifying database tables...\n");
    
    // Query to get all tables
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log("📊 Existing tables in database:");
    console.log("================================");
    
    const tables = result as any[];
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
    
    const userColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      ORDER BY ordinal_position;
    `);
    
    (userColumns as any[]).forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

verifyTables();
