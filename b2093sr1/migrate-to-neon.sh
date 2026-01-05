#!/bin/bash

# Script to migrate database schema to Neon cloud database
# This script temporarily uses the Neon connection to push the schema

NEON_URL="postgresql://neondb_owner:npg_cBjU7dfACgY1@ep-restless-math-a4rcfdpw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "🚀 Migrating database schema to Neon cloud..."
echo ""

# Run drizzle push with Neon URL
DATABASE_URL="$NEON_URL" npm run db:push

echo ""
echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Add DATABASE_URL to your deployment platform (Vercel/Netlify/etc.)"
echo "2. Set: DATABASE_URL=$NEON_URL"
echo "3. Deploy your application"
