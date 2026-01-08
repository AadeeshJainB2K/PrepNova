#!/bin/bash

# Script to migrate mock test tables to Neon database
# Usage: ./migrate-mock-tests-to-neon.sh <NEON_DATABASE_URL>

if [ -z "$1" ]; then
  echo "❌ Error: Neon database URL required"
  echo "Usage: ./migrate-mock-tests-to-neon.sh <NEON_DATABASE_URL>"
  echo ""
  echo "Example:"
  echo "./migrate-mock-tests-to-neon.sh 'postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require'"
  exit 1
fi

NEON_URL="$1"

echo "🔄 Migrating mock test tables to Neon database..."
echo ""

# Run the migration
psql "$NEON_URL" -f scripts/create-mock-test-tables.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration completed successfully!"
  echo ""
  echo "📊 Created tables:"
  echo "   - mock_test_sessions"
  echo "   - user_progress"
  echo "   - mock_questions"
  echo "   - user_exam_preferences"
  echo "   - exam_timelines"
  echo "   - study_groups"
  echo "   - study_group_members"
  echo "   - user_achievements"
  echo ""
  echo "🎉 Your Neon database is ready for the infinite mock test feature!"
else
  echo ""
  echo "❌ Migration failed. Please check the error messages above."
  exit 1
fi
