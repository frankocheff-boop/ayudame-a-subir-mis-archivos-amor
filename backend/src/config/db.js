// Postgres pool using 'pg'
const { Pool } = require('pg');
const url = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: url,
  // you can add ssl: { rejectUnauthorized: false } if using managed PG with SSL
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
