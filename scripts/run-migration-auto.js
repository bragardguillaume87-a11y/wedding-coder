#!/usr/bin/env node

/**
 * ========================================
 * AUTOMATIC MIGRATION RUNNER
 * ========================================
 *
 * This script automatically runs SQL migrations against Supabase PostgreSQL
 *
 * Features:
 * - Parses Supabase URL from .env.local
 * - Prompts for database password if needed
 * - Executes migration file
 * - Verifies columns were created
 * - Comprehensive error handling
 *
 * Usage:
 *   node scripts/run-migration-auto.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ========================================
// CONFIGURATION
// ========================================

const MIGRATION_FILE = path.join(__dirname, '..', 'supabase', 'migrations', '20251227_add_geocoding_to_events.sql');
const ENV_FILE = path.join(__dirname, '..', '.env.local');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Print colored output
 */
function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function printHeader(title) {
  print('\n' + '='.repeat(50), 'cyan');
  print(title, 'bright');
  print('='.repeat(50), 'cyan');
}

/**
 * Print success message
 */
function printSuccess(message) {
  print(`✓ ${message}`, 'green');
}

/**
 * Print error message
 */
function printError(message) {
  print(`✗ ${message}`, 'red');
}

/**
 * Print warning message
 */
function printWarning(message) {
  print(`⚠ ${message}`, 'yellow');
}

/**
 * Print info message
 */
function printInfo(message) {
  print(`ℹ ${message}`, 'blue');
}

/**
 * Parse .env.local file
 */
function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};

    content.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) return;

      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });

    return env;
  } catch (error) {
    throw new Error(`Failed to parse .env.local: ${error.message}`);
  }
}

/**
 * Extract project ref from Supabase URL
 */
function extractProjectRef(supabaseUrl) {
  try {
    const url = new URL(supabaseUrl);
    // URL format: https://[project-ref].supabase.co
    const hostname = url.hostname;
    const match = hostname.match(/^([a-z0-9]+)\.supabase\.co$/);

    if (!match) {
      throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
    }

    return match[1];
  } catch (error) {
    throw new Error(`Failed to extract project ref: ${error.message}`);
  }
}

/**
 * Prompt for password (hidden input)
 */
function promptPassword(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Hide password input
    const stdin = process.stdin;
    stdin.on('data', (char) => {
      const str = char.toString();
      if (str === '\n' || str === '\r' || str === '\u0004') {
        stdin.pause();
      } else {
        process.stdout.write('\x1b[2K\x1b[200D' + question + '*'.repeat(rl.line.length));
      }
    });

    rl.question(question, (password) => {
      rl.close();
      console.log(''); // New line after password
      resolve(password);
    });
  });
}

/**
 * Build PostgreSQL connection string
 */
function buildConnectionString(projectRef, password) {
  return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
}

/**
 * Read migration file
 */
function readMigrationFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Migration file not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Execute SQL query
 */
async function executeQuery(client, query, description) {
  try {
    printInfo(`Executing: ${description}...`);
    const result = await client.query(query);
    printSuccess(`${description} completed`);
    return result;
  } catch (error) {
    printError(`${description} failed: ${error.message}`);
    throw error;
  }
}

/**
 * Verify columns were created
 */
async function verifyMigration(client) {
  printHeader('VERIFICATION');

  const columnsToCheck = ['latitude', 'longitude', 'country_code', 'geocoded_at', 'geocoding_source'];

  printInfo('Checking if columns were created...');

  const columnQuery = `
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'local_events'
      AND column_name = ANY($1)
    ORDER BY ordinal_position;
  `;

  const result = await client.query(columnQuery, [columnsToCheck]);

  if (result.rows.length === 0) {
    throw new Error('No columns found! Migration may have failed.');
  }

  print('\nColumns created:', 'bright');
  result.rows.forEach(col => {
    const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
    const defaultValue = col.column_default ? `DEFAULT ${col.column_default}` : '';
    print(`  • ${col.column_name} (${col.data_type}) ${nullable} ${defaultValue}`, 'green');
  });

  // Check for missing columns
  const foundColumns = result.rows.map(r => r.column_name);
  const missingColumns = columnsToCheck.filter(col => !foundColumns.includes(col));

  if (missingColumns.length > 0) {
    printWarning(`Missing columns: ${missingColumns.join(', ')}`);
  } else {
    printSuccess('All expected columns created!');
  }

  // Verify indexes
  printInfo('\nChecking indexes...');

  const indexQuery = `
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'local_events'
      AND indexname LIKE 'idx_local_events_%';
  `;

  const indexResult = await client.query(indexQuery);

  if (indexResult.rows.length > 0) {
    print('\nIndexes created:', 'bright');
    indexResult.rows.forEach(idx => {
      print(`  • ${idx.indexname}`, 'green');
      print(`    ${idx.indexdef}`, 'dim');
    });
  } else {
    printWarning('No indexes found (may have been created with different names)');
  }

  return {
    columnsCreated: result.rows.length,
    indexesCreated: indexResult.rows.length,
    allColumnsPresent: missingColumns.length === 0,
  };
}

/**
 * Main migration function
 */
async function runMigration() {
  printHeader('AUTOMATIC MIGRATION RUNNER');

  let client;

  try {
    // Step 1: Load environment variables
    printInfo('Loading environment variables...');
    const env = parseEnvFile(ENV_FILE);

    if (!env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
    }

    printSuccess(`Found Supabase URL: ${env.NEXT_PUBLIC_SUPABASE_URL}`);

    // Step 2: Extract project ref
    const projectRef = extractProjectRef(env.NEXT_PUBLIC_SUPABASE_URL);
    printSuccess(`Project ref: ${projectRef}`);

    // Step 3: Get database password
    let password = process.env.SUPABASE_DB_PASSWORD;

    if (!password) {
      print('\n');
      printWarning('Database password not found in environment variables');
      printInfo('You can find your database password in your Supabase dashboard:');
      printInfo('  1. Go to https://supabase.com/dashboard/project/' + projectRef + '/settings/database');
      printInfo('  2. Look for "Database password" under "Connection string"');
      print('\n');
      password = await promptPassword('Enter database password: ');

      if (!password) {
        throw new Error('Password is required');
      }
    } else {
      printSuccess('Using password from environment variable');
    }

    // Step 4: Build connection string
    const connectionString = buildConnectionString(projectRef, password);
    printSuccess('Connection string built');

    // Step 5: Read migration file
    printInfo(`Reading migration file: ${MIGRATION_FILE}`);
    const migrationSQL = readMigrationFile(MIGRATION_FILE);
    const sqlLines = migrationSQL.split('\n').filter(l => l.trim() && !l.trim().startsWith('--')).length;
    printSuccess(`Migration file loaded (${sqlLines} non-comment lines)`);

    // Step 6: Connect to database
    printHeader('DATABASE CONNECTION');
    printInfo('Connecting to Supabase PostgreSQL...');

    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    await client.connect();
    printSuccess('Connected to database!');

    // Test connection
    const versionResult = await client.query('SELECT version()');
    printInfo(`PostgreSQL: ${versionResult.rows[0].version.split(',')[0]}`);

    // Step 7: Execute migration
    printHeader('EXECUTING MIGRATION');

    printWarning('About to execute migration...');
    printInfo(`File: ${path.basename(MIGRATION_FILE)}`);
    print('\n');

    // Execute the migration
    await executeQuery(client, migrationSQL, 'Migration execution');

    // Step 8: Verify migration
    const verification = await verifyMigration(client);

    // Step 9: Summary
    printHeader('MIGRATION SUMMARY');

    if (verification.allColumnsPresent) {
      printSuccess('Migration completed successfully!');
      print(`\n  Columns created: ${verification.columnsCreated}`, 'green');
      print(`  Indexes created: ${verification.indexesCreated}`, 'green');

      print('\n');
      printInfo('Next steps:');
      print('  1. The local_events table now has geocoding columns', 'dim');
      print('  2. You can start adding latitude/longitude data to events', 'dim');
      print('  3. Use the geocoding API to populate coordinates from addresses', 'dim');

      return 0; // Success exit code
    } else {
      printWarning('Migration completed but some columns are missing');
      printWarning('Please check the verification output above');
      return 1; // Warning exit code
    }

  } catch (error) {
    printHeader('MIGRATION FAILED');
    printError(error.message);

    if (error.code) {
      print(`\nError code: ${error.code}`, 'red');
    }

    if (error.code === 'ECONNREFUSED') {
      printInfo('\nConnection refused. Common causes:');
      print('  • Wrong project ref', 'dim');
      print('  • Database is paused (wake it up in Supabase dashboard)', 'dim');
      print('  • Network/firewall issues', 'dim');
    } else if (error.code === '28P01') {
      printInfo('\nAuthentication failed. Common causes:');
      print('  • Wrong database password', 'dim');
      print('  • Password contains special characters (try URL encoding)', 'dim');
    } else if (error.code === '42P07') {
      printWarning('\nColumns or indexes may already exist');
      printInfo('This is normal if you ran the migration before');
      printInfo('Run the verification query to check current state');
    }

    print('\n');
    printInfo('Stack trace:');
    console.error(error);

    return 1; // Error exit code

  } finally {
    // Always close connection
    if (client) {
      try {
        await client.end();
        printInfo('\nDatabase connection closed');
      } catch (error) {
        // Ignore errors when closing
      }
    }
  }
}

// ========================================
// ENTRY POINT
// ========================================

if (require.main === module) {
  runMigration()
    .then(exitCode => {
      process.exit(exitCode);
    })
    .catch(error => {
      printError('Unexpected error:');
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runMigration };
