INSERT INTO movies (filename)
VALUES ($1)
RETURNING movies.id;
