# QuickNotes Database Design

## 1. Introduction

QuickNotes will use a relational database to store and manage user information, notes and tags.

The database will contain four main entities:

1. Users
2. Notes
3. Tags
4. Note_Tags

The database will use PostgreSQL because it supports relationships, foreign keys, transactions, indexing and reliable data storage.

---

## 2. Database Entities and Their Columns

### 2.1 Users Table

The users table stores information about registered QuickNotes users.

| Column        | Data Type    | Key         | Description             |
| ------------- | ------------ | ----------- | ----------------------- |
| id            | BIGINT       | Primary Key | Unique user identifier  |
| name          | VARCHAR(100) |             | User's full name        |
| email         | VARCHAR(255) | UNIQUE      | User's email address    |
| password_hash | VARCHAR(255) |             | Encrypted password hash |
| created_at    | TIMESTAMP    |             | Account creation date   |

### 2.2 Notes Table

The notes table stores notes created by users.

| Column     | Data Type    | Key         | Description                |
| ---------- | ------------ | ----------- | -------------------------- |
| id         | BIGINT       | Primary Key | Unique note identifier     |
| user_id    | BIGINT       | Foreign Key | References users.id        |
| title      | VARCHAR(100) |             | Note title                 |
| body       | TEXT         |             | Note content               |
| created_at | TIMESTAMP    |             | Date note was created      |
| updated_at | TIMESTAMP    |             | Date note was last updated |

### 2.3 Tags Table

The tags table stores labels that users can apply to their notes.

| Column     | Data Type   | Key         | Description           |
| ---------- | ----------- | ----------- | --------------------- |
| id         | BIGINT      | Primary Key | Unique tag identifier |
| user_id    | BIGINT      | Foreign Key | References users.id   |
| name       | VARCHAR(50) |             | Tag name              |
| created_at | TIMESTAMP   |             | Date tag was created  |

### 2.4 Note_Tags Table

The note_tags table connects notes and tags.

| Column  | Data Type | Key                      | Description         |
| ------- | --------- | ------------------------ | ------------------- |
| note_id | BIGINT    | Primary Key, Foreign Key | References notes.id |
| tag_id  | BIGINT    | Primary Key, Foreign Key | References tags.id  |

The combination of note_id and tag_id forms a composite primary key.

---

## 3. Database Relationships

### One-to-Many Relationship

One user can create many notes, but each note belongs to only one user.

Relationship:

Users (1) → Notes (Many)

One user can also create multiple tags, but each tag belongs to one user.

Relationship:

Users (1) → Tags (Many)

### Many-to-Many Relationship

A note can have several tags, and a tag can be applied to several notes.

Relationship:

Notes (Many) ↔ Tags (Many)

The note_tags junction table manages this relationship using note_id and tag_id.

---

## 4. SQL CREATE TABLE Statements

The following SQL statements create the four database tables.

### Create Users Table

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create Notes Table

```sql
CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notes_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
```

### Create Tags Table

```sql
CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tags_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT unique_user_tag UNIQUE (user_id, name)
);
```

### Create Note_Tags Table

```sql
CREATE TABLE note_tags (
    note_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,

    PRIMARY KEY (note_id, tag_id),

    CONSTRAINT fk_note_tags_note
    FOREIGN KEY (note_id)
    REFERENCES notes(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_note_tags_tag
    FOREIGN KEY (tag_id)
    REFERENCES tags(id)
    ON DELETE CASCADE
);
```

---

## 5. Example SQL Queries

### Query 1: Retrieve all notes belonging to a user

```sql
SELECT *
FROM notes
WHERE user_id = 1;
```

This query retrieves all notes created by user with ID 1.

### Query 2: Create a new note

```sql
INSERT INTO notes (user_id, title, body)
VALUES (1, 'Meeting Notes', 'Prepare the project presentation.');
```

This query inserts a new note into the database.

### Query 3: Retrieve notes with their tags (JOIN)

```sql
SELECT
    notes.title,
    notes.body,
    tags.name AS tag_name
FROM notes
JOIN note_tags
    ON notes.id = note_tags.note_id
JOIN tags
    ON note_tags.tag_id = tags.id
WHERE notes.user_id = 1;
```

This query combines three tables to display each note alongside its assigned tags.

### Query 4: Count notes created by each user

```sql
SELECT
    users.name,
    COUNT(notes.id) AS total_notes
FROM users
LEFT JOIN notes
    ON users.id = notes.user_id
GROUP BY users.id, users.name;
```

This query shows the total number of notes created by each user, including users who have not created any notes.

---

## 6. Database Indexes

Indexes improve database query performance by reducing the amount of data the database needs to scan.

### Index 1: Notes by User

```sql
CREATE INDEX idx_notes_user_id
ON notes(user_id);
```

Reason:

This index improves the performance of retrieving notes belonging to a particular user.

### Index 2: Tags by User

```sql
CREATE INDEX idx_tags_user_id
ON tags(user_id);
```

Reason:

This index speeds up searches for tags belonging to a specific user.

### Index 3: Notes by Creation Date

```sql
CREATE INDEX idx_notes_created_at
ON notes(created_at);
```

Reason:

This index improves queries that sort or filter notes by their creation date.

The primary keys and unique constraints also create indexes automatically in PostgreSQL.

---

## 7. SQL vs NoSQL Database Decision

QuickNotes will use PostgreSQL, which is a relational SQL database.

This choice is appropriate because QuickNotes has structured data and clear relationships between users, notes and tags.

SQL provides primary keys, foreign keys and constraints that help maintain data accuracy and prevent invalid relationships.

PostgreSQL also supports transactions, which ensure that related database operations are completed reliably.

Although NoSQL databases can offer flexible schemas and horizontal scaling, PostgreSQL is a better starting choice for QuickNotes because its data is naturally relational.

PostgreSQL can also scale through read replicas, caching and database partitioning as the application grows to support one million users.

---

## 8. Conclusion

The proposed database design provides a structured and reliable way to store QuickNotes data.

The four tables support user accounts, note creation, tag management and many-to-many relationships.

Indexes improve query performance, while primary and foreign keys maintain data integrity.

The design can support future growth as QuickNotes expands to serve more users.
