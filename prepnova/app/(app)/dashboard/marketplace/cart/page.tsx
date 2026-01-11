import { getCart } from "@/lib/marketplace/actions";
import { CartClient } from "./CartClient";

// Server Component - fetches data on the server
export default async function CartPage() {
  // Fetch cart items on the server
  const cartItems = await getCart();

  // Pass to client component for interactivity
  return <CartClient initialItems={cartItems} />;
}
