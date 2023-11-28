SELECT
  media.id,
  media.file_name,
  media.media_name,
  metadata.title,
  metadata.description,
  metadata.release_date
FROM media
LEFT JOIN metadata ON media.metadata_id = metadata.id
WHERE media.id = $1;