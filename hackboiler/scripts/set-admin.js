import { db } from './lib/db/index.js';
import { users } from './lib/db/schema.js';
import { eq } from 'drizzle-orm';

async function setAdmin() {
  try {
    // Update user role to admin
    const result = await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, 'aadeeshjain15@gmail.com'))
      .returning();

    if (result.length > 0) {
      console.log('✅ Successfully set as admin:');
      console.log('Name:', result[0].name);
      console.log('Email:', result[0].email);
      console.log('Role:', result[0].role);
    } else {
      console.log('❌ User not found. Please login first to create your account.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setAdmin();
