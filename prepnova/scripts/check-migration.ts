import postgres from 'postgres';

const databases = [
  {
    name: 'Local PostgreSQL',
    url: 'postgresql://abhajain:2010@localhost:5432/prepnova'
  },
  {
    name: 'Neon Database',
    url: 'postgresql://neondb_owner:npg_cBjU7dfACgY1@ep-restless-math-a4rcfdpw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
  }
];

async function checkColumn() {
  for (const database of databases) {
    console.log(`\n🔍 Checking ${database.name}...`);
    const sql = postgres(database.url, { max: 1 });
    
    try {
      const result = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'mock_questions' 
        AND column_name IN ('base_explanation', 'ai_model')
      `;
      
      console.log('  Columns found:', result.map(r => r.column_name).join(', '));
      
      const result2 = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'mock_test_sessions' 
        AND column_name = 'ai_model'
      `;
      
      console.log('  mock_test_sessions.ai_model:', result2.length > 0 ? '✅ exists' : '❌ missing');
      
    } catch (err: unknown) {
      console.error(`❌ Error:`, err instanceof Error ? err.message : String(err));
      process.exit(1);
    } finally {
      await sql.end();
    }
  }
}

checkColumn();
