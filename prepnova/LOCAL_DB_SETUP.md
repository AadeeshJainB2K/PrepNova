# Local Database Setup for Exam-Compass

## Quick Start with Docker

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL database with:
- **Host**: localhost
- **Port**: 5432
- **Database**: examcompass
- **Username**: examuser
- **Password**: exampass123

### 2. Update .env.local

Update your `.env.local` file with this DATABASE_URL:

```
DATABASE_URL="postgresql://examuser:exampass123@localhost:5432/examcompass"
```

### 3. Run Migration

```bash
npx tsx scripts/run-exam-compass-migration.ts
```

### 4. Verify Database

```bash
npx tsx scripts/verify-db.ts
```

---

## Alternative: Install PostgreSQL Locally (Without Docker)

### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database and user
createdb examcompass
psql examcompass -c "CREATE USER examuser WITH PASSWORD 'exampass123';"
psql examcompass -c "GRANT ALL PRIVILEGES ON DATABASE examcompass TO examuser;"
psql examcompass -c "GRANT ALL ON SCHEMA public TO examuser;"
```

Then use the same DATABASE_URL:
```
DATABASE_URL="postgresql://examuser:exampass123@localhost:5432/examcompass"
```

---

## Useful Commands

### Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f

# Access PostgreSQL shell
docker exec -it exam-compass-db psql -U examuser -d examcompass

# Stop and remove all data
docker-compose down -v
```

### Database Commands

```bash
# Run migration
npx tsx scripts/run-exam-compass-migration.ts

# Verify tables
npx tsx scripts/verify-db.ts

# Access database directly
psql postgresql://examuser:exampass123@localhost:5432/examcompass
```

---

## Troubleshooting

### Port 5432 already in use

If you have PostgreSQL already running:

```bash
# Stop existing PostgreSQL
brew services stop postgresql

# Or change the port in docker-compose.yml
# Change "5432:5432" to "5433:5432"
# Then update DATABASE_URL to use port 5433
```

### Permission denied

```bash
# Make sure Docker is running
docker ps

# Restart Docker Desktop if needed
```

---

## Next Steps

After local database is working:

1. Test all features locally
2. Seed sample exam data
3. Then migrate to Neon for production
