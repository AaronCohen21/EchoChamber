const SQLQuery = require('../../sql/SQLQuery');

const STATIC_DIR = `${__dirname}/../../static`;
module.exports.STATIC_DIR = STATIC_DIR;

module.exports.createDbEntry = async (fileName, salt) => {
  const createDbEntryQuery = new SQLQuery('add_movie');
  const dbResponse = await createDbEntryQuery.executeWithParams([
    salt + fileName,
    fileName,
  ]);

  return dbResponse.rows[0].id;
};

module.exports.validateFile = file => {
  return file.mimetype.split('/')[0] === 'video';
};
