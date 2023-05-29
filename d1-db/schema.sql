DROP TABLE IF EXISTS Shared;
CREATE TABLE IF NOT EXISTS Shared (
    id        INTEGER   PRIMARY KEY,
    title     TEXT      NOT NULL,
    author    TEXT      NOT NULL DEFAULT 'anonymous',
    vertex    TEXT,
    pixel     TEXT,
    slug      TEXT      NOT NULL UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
