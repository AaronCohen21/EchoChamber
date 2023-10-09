CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Metadata (
    Id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY NOT NULL,
    Thumbnail varchar(255),
    Title varchar(255),
    Description varchar(255),
    ReleaseDate varchar(255)
);

CREATE TABLE Movies (
    Id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY NOT NULL,
    FileName varchar(255) NOT NULL,
    MetadataId uuid,
    FOREIGN KEY (MetadataId) REFERENCES Metadata(Id)
        ON UPDATE CASCADE
);
