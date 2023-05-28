DROP TABLE IF EXISTS Shared;
CREATE TABLE IF NOT EXISTS Shared (
    ID     INTEGER PRIMARY KEY,
    Title  TEXT    NOT NULL,
    Author TEXT    DEFAULT 'anonymous',
    Vertex TEXT,
    Pixel  TEXT
);

INSERT INTO Shared (Title, Vertex, Pixel)
VALUES ('TestTitle', 'emptyVS', 'emptyPS');

INSERT INTO Shared (Title, Pixel)
VALUES ('No Pixel', 'Vertex');

INSERT INTO Shared (Title, Pixel)
VALUES ('No Vertex', 'Pixel');

INSERT INTO Shared (Title, Author, Vertex, Pixel)
VALUES ('With Author', 'TestAuthor', 'empty', 'empty');
