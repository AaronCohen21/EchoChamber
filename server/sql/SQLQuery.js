const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// This class allows querys to be executed from the sql directory by only referencing the file by name
// It also provides a static method to execute sql without having to deal with the boilerplate of connecting a client

module.exports = class SQLQuery {
  #query;
  #client;

  constructor(fileName) {
    this.#query = fs.readFileSync(
      path.resolve(`${__dirname}/${fileName}.sql`),
      {
        encoding: 'utf8',
        flag: 'r',
      }
    );
  }

  #createClient = () => {
    this.#client = new Client({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
    });
  };

  execute = async (params = []) => {
    // Validate params is an array
    if (!Array.isArray(params)) {
      throw new Error('params is not an array');
    }

    this.#createClient();

    await this.#client.connect();
    const dbResponse = await this.#client.query(this.#query, params);
    await this.#client.end();
    return dbResponse;
  };

  static executeQuery = async (query, params = []) => {
    const client = new Client({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
    });
    await client.connect();
    const dbResponse = await client.query(query, params);
    await client.end();
    return dbResponse;
  };
};
