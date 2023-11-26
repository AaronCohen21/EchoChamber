SELECT * FROM media
LEFT JOIN metadata ON media.metadata_id = metadata.id
WHERE media.id = $1;