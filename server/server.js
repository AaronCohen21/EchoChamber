const express = require('express');
const routes = require('require-dir-all')('./routes', {
  recursive: true,
  includeFiles: 'index.js',
});

const PORT = 1738;
const app = express();

Object.keys(routes).forEach(route => {
  app.use(`/api/v1/${route}`, routes[route].index);
});

app.listen(PORT, () => {
  console.log(`Echo Chamber running on PORT:${PORT}`);
});
