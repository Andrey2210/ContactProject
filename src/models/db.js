const { Pool } = require('pg');
require('dotenv').config();
const debug = require('debug')('pool');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/MyBD',
    ssl: true
});
 
pool.on('connect', () => {
    debug('connected to the db');
});
