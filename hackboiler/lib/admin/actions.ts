"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, like, or } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Check if user is admin
export async function isAdmin() {
  const session = await auth();
  if (!session?.user?.email) return false;
  
  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });
  
  return user?.role === "admin";
}

// Get all users (admin only)
export async function getAllUsers(searchQuery?: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized", users: [] };
    }

    let allUsers;
    if (searchQuery) {
      allUsers = await db.query.users.findMany({
        where: or(
          like(users.email, `%${searchQuery}%`),
          like(users.name, `%${searchQuery}%`)
        ),
        orderBy: (users, { desc }) => [desc(users.id)],
      });
    } else {
      allUsers = await db.query.users.findMany({
        orderBy: (users, { desc }) => [desc(users.id)],
      });
    }

    return { success: true, users: allUsers };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users", users: [] };
  }
}

// Update user role (admin only)
export async function updateUserRole(userId: string, newRole: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    if (!["admin", "seller", "user"].includes(newRole)) {
      return { success: false, error: "Invalid role" };
    }

    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update role" };
  }
}
