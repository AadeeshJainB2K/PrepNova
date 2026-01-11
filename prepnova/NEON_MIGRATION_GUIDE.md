# Migrating to Neon Database (Production)

## Step 1: Create Neon Database

1. **Go to Neon Console**: https://console.neon.tech/
2. **Create a New Project**:
   - Click "New Project"
   - Name: `exam-compass-prod`
   - Region: Choose closest to your users (e.g., US East, EU West, Asia Pacific)
   - PostgreSQL version: 16 (recommended)

3. **Get Connection String**:
   - After creation, copy the connection string
   - It will look like: `postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

## Step 2: Update Environment Variables

Create a new `.env.production` file or add to your deployment platform:

```bash
# Neon Production Database
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Keep other variables
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
GOOGLE_GENERATIVE_AI_API_KEY="your-key"
```

## Step 3: Run Migration on Neon

### Option A: Using the Migration Script (Recommended)

```bash
# Set the Neon DATABASE_URL temporarily
export DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Run migration
npx tsx scripts/migrate-to-neon.ts

# Run seed data
npx tsx scripts/seed-exams.ts
```

### Option B: Using psql directly

```bash
psql "postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require" -f scripts/exam-compass-migration.sql
```

## Step 4: Verify Neon Database

```bash
# Verify tables were created
npx tsx scripts/verify-neon.ts
```

## Step 5: Deploy to Production

### Vercel Deployment

1. **Add Environment Variable**:
   ```bash
   vercel env add DATABASE_URL production
   # Paste your Neon connection string
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### Other Platforms

- **Netlify**: Add to Environment Variables in dashboard
- **Railway**: Add to Variables section
- **Render**: Add to Environment section

## Step 6: Backup Strategy

### Automated Backups (Neon Pro)
- Neon automatically backs up your database
- Point-in-time recovery available
- Retention: 7 days (Free), 30 days (Pro)

### Manual Backup

```bash
# Export from local
pg_dump postgresql://abhajain:2010@localhost:5432/prepnova > backup.sql

# Import to Neon
psql "postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require" < backup.sql
```

## Step 7: Database Branching (Optional)

Neon supports database branching for development:

```bash
# Create a branch for testing
neon branches create --name staging

# Get branch connection string
neon connection-string staging
```

## Troubleshooting

### Connection Issues

1. **SSL Required**: Make sure `?sslmode=require` is in the connection string
2. **IP Allowlist**: Check if Neon has IP restrictions enabled
3. **Password Special Characters**: URL-encode special characters in password

### Migration Errors

1. **Tables Already Exist**: Drop tables first or use `IF NOT EXISTS`
2. **Permission Denied**: Ensure user has CREATE privileges
3. **Connection Timeout**: Increase timeout in connection string

## Cost Optimization

### Free Tier Limits
- 0.5 GB storage
- 1 compute unit
- 100 hours compute time/month

### Tips
- Use connection pooling (Neon provides this)
- Enable auto-suspend (Neon does this automatically)
- Monitor usage in Neon dashboard

## Monitoring

### Neon Dashboard
- Query performance
- Storage usage
- Connection count
- Compute time

### Application Monitoring
```typescript
// Add to your app
import { db } from "@/lib/db";

// Log slow queries
db.$on('query', (e) => {
  if (e.duration > 1000) {
    console.warn('Slow query:', e.query, e.duration);
  }
});
```

## Next Steps

1. ✅ Local database working
2. ✅ Migration script ready
3. ⏳ Create Neon project
4. ⏳ Run migration on Neon
5. ⏳ Update production environment variables
6. ⏳ Deploy application

---

## Quick Commands Reference

```bash
# Migrate to Neon
npx tsx scripts/migrate-to-neon.ts

# Seed Neon database
DATABASE_URL="neon-url" npx tsx scripts/seed-exams.ts

# Verify Neon
npx tsx scripts/verify-neon.ts

# Backup local to Neon
pg_dump postgresql://abhajain:2010@localhost:5432/prepnova | \
psql "neon-connection-string"
```
