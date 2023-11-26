const SQLQuery = require('../../sql/SQLQuery');

const STATIC_DIR = `${__dirname}/../../static`;
module.exports.STATIC_DIR = STATIC_DIR;

module.exports.addMedia = async (fileName, salt) => {
  const query = new SQLQuery('add_media');
  return (
    await query.execute([
      salt + fileName,
      fileName,
      new Date(Date.now()).toISOString(),
    ])
  ).rows[0].id;
};

module.exports.validateMedia = file => {
  const maxUploadSize = parseInt(process.env.MAX_MEDIA_SIZE);
  return (
    file.mimetype.split('/')[0] === 'video' &&
    (file.size <= maxUploadSize || maxUploadSize === -1)
  );
};
