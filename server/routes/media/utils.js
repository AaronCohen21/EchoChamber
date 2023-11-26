const SQLQuery = require('../../sql/SQLQuery');

module.exports.validateImage = async buffer => {
  try {
    const maxThumbnailSize = parseInt(process.env.MAX_THUMBNAIL_SIZE);
    const { fileTypeFromBuffer } = await import('file-type');
    const bufferMimeType = (await fileTypeFromBuffer(buffer)).mime;

    return (
      bufferMimeType.split('/')[0] === 'image' &&
      (Buffer.byteLength(buffer) <= maxThumbnailSize || maxThumbnailSize === -1)
    );
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports.getMediaFromUuid = async uuid => {
  // Test to ensure it is a valid uuid that is being sent, if not return -1 to signify a 400 error should be thrown
  const uuidValidationRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidValidationRegex.test(uuid)) return -1;

  const getMediaQuery = new SQLQuery('get_media');
  const mediaData = await getMediaQuery.execute([uuid]);
  if (!mediaData.rowCount) return null;
  return mediaData.rows[0];
};

module.exports.metadataUpsert = async (
  mediaUuid,
  thumbnail,
  title,
  description,
  releaseDate
) => {
  const metadataUpsertQuery = await SQLQuery.executeQuery(
    'SELECT upsert($1, $2, $3, $4, $5) AS id;',
    [mediaUuid, thumbnail, title, description, releaseDate]
  );
  return metadataUpsertQuery.rows[0].id;
};
