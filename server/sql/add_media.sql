INSERT INTO media (file_name, media_name, created)
VALUES ($1, $2, $3)
RETURNING media.id;
