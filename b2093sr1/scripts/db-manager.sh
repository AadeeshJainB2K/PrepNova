#!/bin/bash

# Exam-Compass Database Management Scripts
# Quick reference for common database operations

echo "🗄️  Exam-Compass Database Management"
echo "===================================="
echo ""
echo "Choose an option:"
echo ""
echo "LOCAL DATABASE:"
echo "  1) Verify local database"
echo "  2) Seed local database with sample data"
echo "  3) Backup local database"
echo ""
echo "NEON DATABASE (Production):"
echo "  4) Migrate schema to Neon"
echo "  5) Seed Neon database"
echo "  6) Verify Neon database"
echo "  7) Backup local to Neon"
echo ""
echo "  0) Exit"
echo ""
read -p "Enter choice [0-7]: " choice

case $choice in
  1)
    echo "🔍 Verifying local database..."
    npx tsx scripts/verify-direct.ts
    ;;
  2)
    echo "🌱 Seeding local database..."
    npx tsx scripts/seed-exams.ts
    ;;
  3)
    echo "💾 Backing up local database..."
    pg_dump postgresql://abhajain:2010@localhost:5432/b2093sr1 > "backup-$(date +%Y%m%d-%H%M%S).sql"
    echo "✅ Backup created!"
    ;;
  4)
    echo "🚀 Migrating to Neon..."
    npx tsx scripts/migrate-to-neon.ts
    ;;
  5)
    echo "🌱 Seeding Neon database..."
    echo "⚠️  Make sure NEON_DATABASE_URL is set!"
    read -p "Press Enter to continue or Ctrl+C to cancel..."
    npx tsx scripts/seed-exams.ts
    ;;
  6)
    echo "🔍 Verifying Neon database..."
    npx tsx scripts/verify-neon.ts
    ;;
  7)
    echo "📤 Copying local database to Neon..."
    read -p "Enter Neon DATABASE_URL: " NEON_URL
    pg_dump postgresql://abhajain:2010@localhost:5432/b2093sr1 | psql "$NEON_URL"
    echo "✅ Data copied to Neon!"
    ;;
  0)
    echo "👋 Goodbye!"
    exit 0
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac
