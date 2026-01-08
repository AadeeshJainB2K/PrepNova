import { getAllUsers, isAdmin } from "@/lib/admin/actions";
import { redirect } from "next/navigation";
import { UserTable } from "@/components/admin/UserTable";
import { Search } from "lucide-react";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/dashboard");
  }

  const { search } = await searchParams;
  const result = await getAllUsers(search);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage user roles and permissions
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <form method="GET" className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      {result.success ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <UserTable users={result.users as any} />
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-red-600 dark:text-red-400">{result.error}</p>
        </div>
      )}

      {/* Role Legend */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Role Descriptions
        </h3>
        <div className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <p><strong>Admin:</strong> Full access to all features including user management</p>
          <p><strong>Seller:</strong> Can manage products in the marketplace</p>
          <p><strong>User:</strong> Standard user with basic access</p>
        </div>
      </div>
    </div>
  );
}
