INSERT INTO media (file_name, media_name)
VALUES ($1, $2)
RETURNING media.id;
