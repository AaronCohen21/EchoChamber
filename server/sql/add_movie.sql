INSERT INTO movies (file_name, media_name)
VALUES ($1, $2)
RETURNING movies.id;
