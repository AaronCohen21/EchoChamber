CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE metadata (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY NOT NULL,
    thumbnail TEXT,
    title VARCHAR(255),
    description VARCHAR,
    release_date DATE
);

CREATE TABLE media (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    media_name VARCHAR(255) NOT NULL,
    metadata_id UUID,
    created TIMESTAMP NOT NULL,
    FOREIGN KEY (metadata_id) REFERENCES metadata(id)
        ON UPDATE CASCADE
);
