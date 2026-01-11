import { db } from '../lib/db/index';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function setAdmin() {
  try {
    console.log('Setting admin role for aadeeshjain15@gmail.com...');
    
    // Update user role to admin
    const result = await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, 'sunidhithakur1127@gmail.com'))
      .returning();

    if (result.length > 0) {
      console.log('\n✅ Successfully set as admin:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Name:', result[0].name);
      console.log('Email:', result[0].email);
      console.log('Role:', result[0].role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('\n❌ User not found!');
      console.log('Please login first at https://hackboiler.vercel.app to create your account.\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

setAdmin();
