const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const regions = [
  'aws-0-us-east-1',
  'aws-0-us-west-1',
  'aws-0-eu-central-1',
  'aws-0-ap-south-1',
  'aws-0-ap-southeast-1',
  'aws-0-ap-northeast-1',
  'aws-0-ca-central-1',
  'aws-0-eu-west-1',
  'aws-0-eu-west-2',
  'aws-0-eu-west-3',
  'aws-0-sa-east-1',
  'aws-0-me-central-1',
];

async function migrate() {
  const dbPassword = process.argv[2] || 'winpew-1zurja-woWdaj';
  const projectRef = 'rkqqtrzugymmgitgfzch';

  const sqlPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  for (const region of regions) {
    const host = `${region}.pooler.supabase.com`;
    console.log(`Trying connection to ${host}...`);

    const client = new Client({
      host,
      port: 6543,
      user: `postgres.${projectRef}`,
      password: dbPassword,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000,
    });

    try {
      await client.connect();
      console.log(`✅ Connected successfully to ${host}!`);
      console.log('Executing database schema.sql...');

      await client.query(sql);

      console.log('🎉 MIGRATION SUCCESSFUL! All tables and RLS security policies are created.');
      await client.end();
      return;
    } catch (err) {
      console.log(`  Failed on ${host}: ${err.message}`);
      try {
        await client.end();
      } catch (e) {}
    }
  }

  console.error('All pooler endpoints failed.');
}

migrate();
