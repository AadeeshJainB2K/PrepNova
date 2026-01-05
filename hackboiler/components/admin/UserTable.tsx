"use client";

import { useState } from "react";
import { updateUserRole } from "@/lib/admin/actions";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  credits: number;
}

interface UserTableProps {
  users: User[];
}

const roleColors = {
  admin: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  seller: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  user: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
};

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    const result = await updateUserRole(userId, newRole);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to update role");
    }

    setUpdatingId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Credits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {user.name || "No name"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {user.credits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updatingId === user.id}
                    className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
                      roleColors[user.role as keyof typeof roleColors]
                    } ${updatingId === user.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
