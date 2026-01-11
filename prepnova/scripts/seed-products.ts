import { db } from "../lib/db";
import { products } from "../lib/db/schema";

const sampleProducts = [
  {
    name: "Handcrafted Pottery Vase",
    description: "Beautiful traditional pottery vase handmade by local artisans. Perfect for preserving cultural heritage.",
    price: "2499.00",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500",
    category: "Heritage & Crafts",
    stock: 15,
    isActive: true,
  },
  {
    name: "Chemistry Fundamentals Textbook",
    description: "Comprehensive chemistry textbook for students. Covers all fundamental concepts with practical examples.",
    price: "899.00",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
    category: "Education & Books",
    stock: 50,
    isActive: true,
  },
  {
    name: "Organic Farm Fresh Vegetables",
    description: "Fresh organic vegetables directly from local farms. Supports sustainable agriculture.",
    price: "299.00",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500",
    category: "Agriculture & Food",
    stock: 100,
    isActive: true,
  },
  {
    name: "Traditional Silk Saree",
    description: "Exquisite handwoven silk saree representing Indian textile heritage.",
    price: "5999.00",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
    category: "Heritage & Crafts",
    stock: 8,
    isActive: true,
  },
  {
    name: "Science Lab Equipment Kit",
    description: "Complete lab equipment kit for chemistry experiments. Perfect for students and educators.",
    price: "3499.00",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500",
    category: "Education & Books",
    stock: 20,
    isActive: true,
  },
  {
    name: "Herbal Wellness Package",
    description: "Natural herbal supplements for health and wellness. Ayurvedic formulation.",
    price: "1299.00",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500",
    category: "Healthcare & Wellness",
    stock: 35,
    isActive: true,
  },
  {
    name: "Wooden Handicraft Set",
    description: "Set of traditional wooden handicrafts. Supports local artisan communities.",
    price: "1899.00",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=500",
    category: "Heritage & Crafts",
    stock: 12,
    isActive: true,
  },
  {
    name: "Online Course Bundle",
    description: "Access to premium online courses covering various subjects. Lifetime access included.",
    price: "4999.00",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500",
    category: "Education & Books",
    stock: 999,
    isActive: true,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding database with sample products...");
    
    // Insert products
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
      console.log(`✅ Added: ${product.name}`);
    }
    
    console.log("\n🎉 Database seeded successfully!");
    console.log(`📦 Added ${sampleProducts.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
