const express = require('express');

const PORT = 1738;

const app = express();

app.get('/test', (req, res) => {
  res.status(200).send({ data: 'Hello From Backend' });
});

app.listen(PORT, () => {
  console.log(`Echo Chamber running on PORT:${PORT}`);
});
