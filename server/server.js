const path = require('path');
require('dotenv').config({ path: path.resolve(`${__dirname}/../.env`) });

// TODO: each time before booting the static/tmp directory should be cleared out

const express = require('express');
const cors = require('cors');
const routes = require('require-dir-all')('./routes', {
  recursive: true,
  includeFiles: 'index.js',
});

const PORT = process.env.API_PORT ?? 1738;
const app = express();
app.use(cors());
app.use(express.json());

Object.keys(routes).forEach(route => {
  app.use(`/api/v1/${route}`, routes[route].index);
});

app.listen(PORT, () => {
  console.log(`Echo Chamber API running on PORT:${PORT}`);
});
