# Migration Guide

## Automatic Migration Runner

The `run-migration-auto.js` script automatically runs SQL migrations against your Supabase PostgreSQL database.

## Quick Start

```bash
npm run migrate
```

## What It Does

1. **Parses Configuration**: Reads `NEXT_PUBLIC_SUPABASE_URL` from `.env.local`
2. **Extracts Project Ref**: Automatically extracts the project reference (e.g., `ijgwrkfvfoqllbxdjntl`)
3. **Prompts for Password**: Asks for your database password if not set in environment
4. **Connects to Database**: Uses the `pg` library to connect directly to PostgreSQL
5. **Executes Migration**: Runs the SQL from `supabase/migrations/20251227_add_geocoding_to_events.sql`
6. **Verifies Success**: Checks that columns and indexes were created correctly

## Features

### Robust Error Handling
- Connection errors with helpful diagnostics
- Authentication failures with troubleshooting tips
- Duplicate column detection (if migration was already run)
- Detailed error messages with codes

### Password Management
- Accepts password from `SUPABASE_DB_PASSWORD` environment variable
- Interactive prompt with hidden input if not in environment
- Secure password handling

### Verification
The script verifies:
- All expected columns were created (`latitude`, `longitude`, `country_code`, `geocoded_at`, `geocoding_source`)
- Data types are correct
- Indexes were created successfully
- Provides summary of what was created

### Color-Coded Output
- Green: Success messages
- Red: Errors
- Yellow: Warnings
- Blue: Information
- Cyan: Section headers

## Finding Your Database Password

1. Go to your Supabase dashboard
2. Navigate to: `Project Settings` > `Database`
3. Look for "Database password" under "Connection string"
4. Copy the password

URL: `https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/settings/database`

## Setting Password as Environment Variable

### Option 1: Temporary (Current Session)

```bash
# Windows (CMD)
set SUPABASE_DB_PASSWORD=your-password-here
npm run migrate

# Windows (PowerShell)
$env:SUPABASE_DB_PASSWORD="your-password-here"
npm run migrate

# macOS/Linux
export SUPABASE_DB_PASSWORD=your-password-here
npm run migrate
```

### Option 2: Add to .env.local

```env
SUPABASE_DB_PASSWORD=your-password-here
```

Then run:
```bash
npm run migrate
```

**Warning**: Do NOT commit `.env.local` to git if you add the password!

## Example Output

```
==================================================
AUTOMATIC MIGRATION RUNNER
==================================================
ℹ Loading environment variables...
✓ Found Supabase URL: https://ijgwrkfvfoqllbxdjntl.supabase.co
✓ Project ref: ijgwrkfvfoqllbxdjntl
✓ Using password from environment variable
✓ Connection string built
ℹ Reading migration file: supabase/migrations/20251227_add_geocoding_to_events.sql
✓ Migration file loaded (25 non-comment lines)

==================================================
DATABASE CONNECTION
==================================================
ℹ Connecting to Supabase PostgreSQL...
✓ Connected to database!
ℹ PostgreSQL: PostgreSQL 15.8

==================================================
EXECUTING MIGRATION
==================================================
⚠ About to execute migration...
ℹ File: 20251227_add_geocoding_to_events.sql

ℹ Executing: Migration execution...
✓ Migration execution completed

==================================================
VERIFICATION
==================================================
ℹ Checking if columns were created...

Columns created:
  • latitude (numeric) NULL
  • longitude (numeric) NULL
  • country_code (character varying) NULL DEFAULT 'FR'::character varying
  • geocoded_at (timestamp with time zone) NULL
  • geocoding_source (character varying) NULL DEFAULT 'nominatim'::character varying

✓ All expected columns created!

ℹ Checking indexes...

Indexes created:
  • idx_local_events_coordinates
  • idx_local_events_country

==================================================
MIGRATION SUMMARY
==================================================
✓ Migration completed successfully!

  Columns created: 5
  Indexes created: 2

ℹ Next steps:
  1. The local_events table now has geocoding columns
  2. You can start adding latitude/longitude data to events
  3. Use the geocoding API to populate coordinates from addresses

ℹ Database connection closed
```

## Troubleshooting

### Connection Refused
```
Error code: ECONNREFUSED
```

**Causes**:
- Wrong project ref
- Database is paused (wake it up in Supabase dashboard)
- Network/firewall issues

**Solution**: Check your Supabase URL and ensure the database is active.

### Authentication Failed
```
Error code: 28P01
```

**Causes**:
- Wrong database password
- Password contains special characters (try URL encoding)

**Solution**: Double-check your password from the Supabase dashboard.

### Columns Already Exist
```
Error code: 42P07
```

**Cause**: Migration was already run before

**Solution**: This is normal! The columns already exist. You can verify with:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'local_events';
```

## Manual Connection String

If you need to construct it manually:

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Example:
```
postgresql://postgres:your-password@db.ijgwrkfvfoqllbxdjntl.supabase.co:5432/postgres
```

## Script Location

- **Script**: `c:\Users\Guillaume\Documents\wedding-coder\scripts\run-migration-auto.js`
- **Migration**: `c:\Users\Guillaume\Documents\wedding-coder\supabase\migrations\20251227_add_geocoding_to_events.sql`

## Advanced Usage

### Run Directly with Node
```bash
node scripts/run-migration-auto.js
```

### With Password in Command
```bash
SUPABASE_DB_PASSWORD=your-password node scripts/run-migration-auto.js
```

### Import in Another Script
```javascript
const { runMigration } = require('./scripts/run-migration-auto');

await runMigration();
```

## Safety Features

- SSL connection with certificate validation disabled (required for Supabase)
- Connection timeout (10 seconds)
- Automatic connection cleanup on success or failure
- Non-destructive: Only adds columns, doesn't delete data
- Idempotent verification (can run multiple times safely)

## What Gets Created

The migration creates these columns in `local_events`:

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `latitude` | DECIMAL(10, 8) | YES | NULL | GPS latitude (-90 to +90) |
| `longitude` | DECIMAL(11, 8) | YES | NULL | GPS longitude (-180 to +180) |
| `country_code` | VARCHAR(2) | YES | 'FR' | ISO country code |
| `geocoded_at` | TIMESTAMP WITH TIME ZONE | YES | NULL | When geocoding happened |
| `geocoding_source` | VARCHAR(50) | YES | 'nominatim' | API source used |

And these indexes:

- `idx_local_events_coordinates`: Speeds up queries by lat/long
- `idx_local_events_country`: Speeds up queries by country

## Next Steps After Migration

1. Test inserting an event with coordinates:
```sql
INSERT INTO local_events (event_name, location_address, latitude, longitude, country_code)
VALUES ('Test Event', '10 Rue de Rivoli, Paris', 48.8566, 2.3522, 'FR');
```

2. Set up geocoding API integration (Nominatim/OpenStreetMap)
3. Build the Leaflet map component to display events
4. Add geocoding function to populate coordinates from addresses

## Support

For issues or questions:
1. Check the error message and code
2. Review the troubleshooting section above
3. Check Supabase dashboard for database status
4. Verify `.env.local` has correct Supabase URL
