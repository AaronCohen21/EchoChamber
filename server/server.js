const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const SQLQuery = require('./sql/SQLQuery');
require('dotenv').config({ path: path.resolve(`${__dirname}/../.env`) });

// Each time before booting the static/tmp directory should be cleared out
const TMP_DIR = path.resolve(`${__dirname}/static/tmp`);
fs.rmSync(TMP_DIR, {
  recursive: true,
  force: true,
});
fs.mkdirSync(TMP_DIR);

// Create a client pool for reusable database connections
// This is written to the global object so that the SQLQuery class can access it
global.dbClientPool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  max: process.env.MAX_POOL_CLIENTS,
  idleTimeoutMillis: process.env.IDLE_TIMEOUT_MILLIS,
  connectionTimeoutMillis: process.env.CONNECTION_TIMEOUT_MILLIS,
});
global.dbClientPool.on('error', err => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// All database functions should be created or refreshed
console.log('Patching Database Functions...');
const dbFuncs = fs.readdirSync(path.resolve(`${__dirname}/sql/functions`));
dbFuncs.forEach(async fileName => {
  await SQLQuery.executeQuery(
    fs.readFileSync(path.resolve(`${__dirname}/sql/functions/${fileName}`), {
      encoding: 'utf8',
      flag: 'r',
    })
  );
});
console.log('Done!');

const express = require('express');
const cors = require('cors');
const routes = require('require-dir-all')(`${__dirname}/routes`, {
  recursive: true,
  includeFiles: 'index.js',
});

const PORT = process.env.API_PORT ?? 1738;
const app = express();
app.use(cors());
app.use(express.json({ limit: process.env.MAX_PAYLOAD_SIZE }));

Object.keys(routes).forEach(route => {
  app.use(`/api/v1/${route}`, routes[route].index);
});

app.listen(PORT, () => {
  console.log(`Echo Chamber API running on PORT:${PORT}`);
});
