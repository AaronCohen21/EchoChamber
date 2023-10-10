const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const STATIC_DIR = `${__dirname}/../../static`;
module.exports.STATIC_DIR = STATIC_DIR;
const SQL_DIR = `${__dirname}/../../sql`;

// TODO - it doesn't seem like anything being thrown in here is getting caught in the block in index.js

module.exports.createDbEntry = async fileName => {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
  });
  await client.connect();
  const sql = fs.readFileSync(
    path.resolve(`${SQL_DIR}/add_movie.sql`).toString(),
    {
      encoding: 'utf8',
      flag: 'r',
    }
  );
  const dbResponse = await client.query(sql, [fileName]);
  await client.end();
  return dbResponse.rows[0].id;
};

module.exports.validateFile = file => {
  let error = false;
  let message = '';
  if (fs.existsSync(`${STATIC_DIR}/video/${file.originalname}`)) {
    error = true;
    message = 'File already exists.';
  }
  return { error: file.mimetype.split('/')[0] !== 'video' || error, message };
};
