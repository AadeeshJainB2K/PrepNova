#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Hackathon Boilerplate Environment Setup ===${NC}\n"

# Generate AUTH_SECRET
AUTH_SECRET=$(openssl rand -base64 32)

echo -e "${GREEN}✓${NC} Generated AUTH_SECRET"
echo -e "${YELLOW}Database:${NC} postgresql://localhost:5432/hackboiler\n"

# Create .env.local file
cat > .env.local << ENVEOF
# Database
DATABASE_URL="postgresql://localhost:5432/hackboiler"

# NextAuth
AUTH_SECRET="$AUTH_SECRET"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# App URL
NEXTAUTH_URL="http://localhost:3000"
ENVEOF

echo -e "${GREEN}✓${NC} Created .env.local file"
echo -e "\n${BLUE}Next steps:${NC}"
echo -e "1. Get Google OAuth credentials from: ${YELLOW}https://console.cloud.google.com/${NC}"
echo -e "2. Edit .env.local and replace:"
echo -e "   - AUTH_GOOGLE_ID"
echo -e "   - AUTH_GOOGLE_SECRET"
echo -e "3. Run: ${YELLOW}npm run db:push${NC}"
echo -e "4. Restart dev server\n"
