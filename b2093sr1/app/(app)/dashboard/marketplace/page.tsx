import { getProducts, getCart } from "@/lib/marketplace/actions";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { ShoppingBag, Search, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  const allProducts = await getProducts();

  // Filter products based on search and category
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = !search || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = !category || category === "all" || product.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(allProducts.map(p => p.category)));

  // Placeholder for cartCount, assuming it will be fetched or calculated elsewhere
  const cartCount = 0; 

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Marketplace</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover products across various categories
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/marketplace/orders">
            <Button variant="outline" className="dark:border-gray-600">
              <Package className="h-4 w-4 mr-2" />
              My Orders
            </Button>
          </Link>
          <Link href="/dashboard/marketplace/cart">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <form method="GET" className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            name="category"
            defaultValue={category || "all"}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
          >
            Search
          </button>
        </form>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {search || category ? "No products found" : "No products available"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {search || category ? "Try adjusting your search or filters" : "Check back later for new products"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
