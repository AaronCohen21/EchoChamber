const fs = require('fs');
const path = require('path');

// This class allows querys to be executed from the sql directory by only referencing the file by name
// It also provides a static method to execute sql without having to deal with the boilerplate of connecting a client

module.exports = class SQLQuery {
  #query;

  constructor(fileName) {
    this.#query = fs.readFileSync(
      path.resolve(`${__dirname}/${fileName}.sql`),
      {
        encoding: 'utf8',
        flag: 'r',
      }
    );
  }

  execute = async (params = []) => {
    // Validate params is an array
    if (!Array.isArray(params)) {
      throw new Error('params is not an array');
    }

    const client = await global.dbClientPool.connect();
    const dbResponse = await client.query(this.#query, params);
    await client.release();
    return dbResponse;
  };

  static executeQuery = async (query, params = []) => {
    const client = await global.dbClientPool.connect();
    const dbResponse = await client.query(query, params);
    await client.release();
    return dbResponse;
  };
};
