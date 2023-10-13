const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

module.exports = class SQLQuery {
  constructor(fileName) {
    this._query = fs.readFileSync(
      path.resolve(`${__dirname}/${fileName}.sql`),
      {
        encoding: 'utf8',
        flag: 'r',
      }
    );
  }

  _createClient = () => {
    this._client = new Client({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
    });
  };

  executeWithParams = async params => {
    // Validate params is an array
    if (!Array.isArray(params)) {
      throw new Error('params is not an array');
    }

    this._createClient();

    await this._client.connect();
    const dbResponse = await this._client.query(this._query, params);
    await this._client.end();
    return dbResponse;
  };

  execute = () => {
    return this.executeWithParams([]);
  };
};
