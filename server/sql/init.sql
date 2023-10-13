CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE metadata (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY NOT NULL,
    thumbnail varchar(255),
    title varchar(255),
    description varchar(255),
    release_date varchar(255)
);

CREATE TABLE movies (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY NOT NULL,
    file_name varchar(255) NOT NULL,
    media_name varchar(255) NOT NULL,
    metadata_id uuid,
    FOREIGN KEY (metadata_id) REFERENCES metadata(id)
        ON UPDATE CASCADE
);
