import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

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

async function migrate() {
  const migrationSQL = fs.readFileSync(
    path.join(process.cwd(), 'drizzle/0004_colorful_roulette.sql'),
    'utf-8'
  );
  
  const statements = migrationSQL
    .split('-->')
    .map(s => s.replace('statement-breakpoint', '').trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const database of databases) {
    console.log(`\n🔄 Migrating ${database.name}...`);
    const sql = postgres(database.url, { max: 1 });
    
    try {
      for (const statement of statements) {
        console.log('  Executing:', statement.substring(0, 80) + '...');
        await sql.unsafe(statement);
      }
      console.log(`✅ ${database.name} migration completed successfully!`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`❌ ${database.name} migration failed:`, errorMessage);
    } finally {
      await sql.end();
    }
  }
}

migrate().catch((err) => {
  console.error('❌ Migration script failed:', err);
  process.exit(1);
});
