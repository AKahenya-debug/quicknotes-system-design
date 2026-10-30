# QuickNotes API Design

## 1. Introduction

QuickNotes is an online note-taking application that allows users to create, view, update, delete and organize their notes.

This document describes the REST API that the backend team will develop to support the QuickNotes application.

The API will use HTTP methods and JSON for communication between the client and server.

Base URL:

https://api.quicknotes.com/v1

All API requests and responses will use JSON format.

---

## 2. REST API Endpoints

| Method | Endpoint    | Description                                            | Success Status |
| ------ | ----------- | ------------------------------------------------------ | -------------- |
| GET    | /notes      | Retrieve all notes belonging to the authenticated user | 200 OK         |
| GET    | /notes/{id} | Retrieve a specific note                               | 200 OK         |
| POST   | /notes      | Create a new note                                      | 201 Created    |
| PUT    | /notes/{id} | Replace an existing note                               | 200 OK         |
| PATCH  | /notes/{id} | Partially update a note                                | 200 OK         |
| DELETE | /notes/{id} | Delete a note                                          | 204 No Content |
| GET    | /tags       | Retrieve all tags belonging to a user                  | 200 OK         |
| POST   | /tags       | Create a new tag                                       | 201 Created    |

---

## 3. Authentication

QuickNotes will use token-based authentication.

Users must include an access token in the Authorization header when accessing protected endpoints.

Example:

Authorization: Bearer <access_token>

The server will verify the token before processing the request.

---

## 4. Creating a Note (POST /notes)

This endpoint allows an authenticated user to create a new note.

### Request

POST /v1/notes

Content-Type: application/json

Authorization: Bearer <access_token>

Request JSON:

{
"title": "My First Note",
"body": "This is my first QuickNotes note."
}

### Successful Response

Status: 201 Created

Response JSON:

{
"id": 101,
"user_id": 1,
"title": "My First Note",
"body": "This is my first QuickNotes note.",
"created_at": "2026-10-30T08:00:00Z",
"updated_at": "2026-10-30T08:00:00Z"
}

---

## 5. Listing Notes (GET /notes)

This endpoint retrieves notes belonging to the authenticated user.

### Request

GET /v1/notes

Authorization: Bearer <access_token>

### Successful Response

Status: 200 OK

Response JSON:

{
"data": [
{
"id": 101,
"user_id": 1,
"title": "My First Note",
"body": "This is my first QuickNotes note.",
"created_at": "2026-10-30T08:00:00Z",
"updated_at": "2026-10-30T08:00:00Z"
},
{
"id": 102,
"user_id": 1,
"title": "Meeting Notes",
"body": "Prepare the project presentation.",
"created_at": "2026-10-29T10:00:00Z",
"updated_at": "2026-10-29T10:00:00Z"
}
],
"pagination": {
"page": 1,
"limit": 10,
"total": 2
}
}

---

## 6. Updating a Note

### Request

PUT /v1/notes/101

Request JSON:

{
"title": "Updated Note",
"body": "This note has been updated."
}

### Successful Response

Status: 200 OK

Response JSON:

{
"id": 101,
"user_id": 1,
"title": "Updated Note",
"body": "This note has been updated.",
"updated_at": "2026-10-30T09:00:00Z"
}

---

## 7. Deleting a Note

### Request

DELETE /v1/notes/101

### Successful Response

Status: 204 No Content

The server permanently removes the note belonging to the authenticated user.

No response body is returned.

---

## 8. Error Handling

The API will use standard HTTP status codes to communicate errors.

| Status Code | Meaning               | Description                                          |
| ----------- | --------------------- | ---------------------------------------------------- |
| 400         | Bad Request           | Invalid request data or missing required fields      |
| 401         | Unauthorized          | User is not authenticated or token is invalid        |
| 403         | Forbidden             | User does not have permission to access the resource |
| 404         | Not Found             | Requested note or resource does not exist            |
| 500         | Internal Server Error | Unexpected server-side error                         |

### Example Error Response

Status: 400 Bad Request

{
"error": {
"code": "VALIDATION_ERROR",
"message": "The note title is required.",
"details": {
"field": "title"
}
}
}

### Example Unauthorized Response

Status: 401 Unauthorized

{
"error": {
"code": "UNAUTHORIZED",
"message": "Authentication is required."
}
}

---

## 9. API Design Considerations

- REST principles are followed through standard HTTP methods.
- JSON is used for request and response data.
- Authentication protects private user notes.
- Users can only access their own notes.
- Pagination prevents returning too many records in one request.
- Consistent HTTP status codes make error handling easier.
- HTTPS will encrypt communication between clients and servers.
- Input validation will protect the API from invalid data.

---

## 10. Conclusion

The QuickNotes REST API provides a structured and secure way for the frontend and backend to communicate.

The design supports note management, authentication, scalability and future features such as tagging and searching.
