const express = require('express');
const cors = require('cors');
const routes = require('require-dir-all')('./routes', {
  recursive: true,
  includeFiles: 'index.js',
});

const PORT = 1738;
const app = express();
app.use(cors());

Object.keys(routes).forEach(route => {
  app.use(`/api/v1/${route}`, routes[route].index);
});

app.listen(PORT, () => {
  console.log(`Echo Chamber API running on PORT:${PORT}`);
});
