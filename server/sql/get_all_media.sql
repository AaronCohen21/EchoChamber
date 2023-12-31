SELECT
  media.id,
  media.file_name,
  media.media_name,
  metadata.thumbnail,
  metadata.title,
  metadata.description,
  metadata.release_date
FROM media
LEFT JOIN metadata ON media.metadata_id = metadata.id
ORDER BY created ASC
LIMIT $1
OFFSET $2;