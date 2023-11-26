const fs = require('fs');
const path = require('path');
const SQLQuery = require('./sql/SQLQuery');
require('dotenv').config({ path: path.resolve(`${__dirname}/../.env`) });

// Each time before booting the static/tmp directory should be cleared out
const TMP_DIR = path.resolve(`${__dirname}/static/tmp`);
fs.rmSync(TMP_DIR, {
  recursive: true,
  force: true,
});
fs.mkdirSync(TMP_DIR);

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
