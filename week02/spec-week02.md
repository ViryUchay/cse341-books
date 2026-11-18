
# Books API Week 02 Specification

Version 2

## Project Goal

Extend the Week 01 Books API to support complete CRUD operations for books and authors using MongoDB.

The API must use custom string IDs, validate incoming data, maintain valid author references, and provide complete Swagger documentation.

All routes must work locally and on the deployed Render application.

---

# Feature 1: Book CRUD Operations and Author References

## 1.1 Book Data Model

Books will be stored in the MongoDB `books` collection.

Each book must contain:

| Field | Type | Requirements |
|---|---|---|
| id | String | Required, unique, immutable custom ID |
| authorId | String | Required, references an existing author's custom ID |
| title | String | Required, trimmed, 1–500 characters |
| publicationDate | String | Required, valid ISO date in YYYY-MM-DD format |

### Validation Rules

- `id` must be 1–64 characters.
- `id` may contain only letters, numbers, underscores, and hyphens.
- `authorId` must be a valid string between 1 and 64 characters.
- `title` must be a non-empty string after trimming.
- `publicationDate` must be a real calendar date in `YYYY-MM-DD` format.
- Object or array values must not be accepted where strings are expected.
- The API must not expose MongoDB's internal `_id` field.
- Book routes must use the custom `id` field.

### Database Indexes

- Create a unique index on `books.id`.
- Create a non-unique index on `books.authorId`.

## 1.2 Relationship to Authors

Each book references an author through `authorId`.

The `authorId` value must match the custom `id` of an existing author.

- Creating a book with an unknown author must return `400`.
- Updating a book with an unknown author must return `400`.
- The relationship is stored on the book document.
- Authors do not need a reverse list of book IDs.
- Related books can be found by retrieving books and filtering by `authorId`.

## 1.3 Book Routes

### GET /books

Purpose: Return all books.

Success:
- `200 OK`
- Response body: an array of book objects.
- An empty array is valid when no books exist.

Errors:
- `500 Internal Server Error` for unexpected server or database errors.

### GET /books/:id

Purpose: Retrieve one book using its custom ID.

Success:
- `200 OK`
- Response body: the matching book object.

Errors:
- `404 Not Found` when the book does not exist.
- `500 Internal Server Error` for unexpected errors.

### POST /books

Purpose: Create a new book.

The request must have a JSON Content-Type header.

Example request:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- `201 Created`
- Response body: the newly created book object.

Errors:
- `400 Bad Request` for missing or invalid fields.
- `400 Bad Request` if the custom book ID already exists.
- `400 Bad Request` if the author does not exist.
- `415 Unsupported Media Type` if the request is not JSON.
- `500 Internal Server Error` for unexpected errors.

The API must handle MongoDB duplicate-key errors, including duplicate IDs caused by concurrent requests.

### PUT /books/:id

Purpose: Replace the editable fields of an existing book.

Example request:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- `200 OK`
- Response body: the updated book object.

Validation and processing order:
1. Check whether the book exists.
2. Return `404` if it does not exist.
3. Validate the submitted fields.
4. Confirm that the submitted author exists.
5. Update the book.

Rules:
- The route ID determines which book is updated.
- Any `id` supplied in the request body must be ignored.
- The custom book ID must remain unchanged.

Errors:
- `400 Bad Request` for invalid or missing fields.
- `400 Bad Request` if the author does not exist.
- `404 Not Found` if the book does not exist.
- `415 Unsupported Media Type` if the request is not JSON.
- `500 Internal Server Error` for unexpected errors.

### DELETE /books/:id

Purpose: Delete a book using its custom ID.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` for unexpected errors.

---

# Feature 2: Author CRUD Operations

## 2.1 Author Data Model

Authors will be stored in the MongoDB `authors` collection.

Each author must contain:

| Field | Type | Requirements |
|---|---|---|
| id | String | Required, unique, immutable custom ID |
| name | String | Required, trimmed, 1–200 characters |
| birthYear | Integer | Required, between 1000 and 2100 inclusive |

### Validation Rules

- `id` must be 1–64 characters.
- `id` may contain only letters, numbers, underscores, and hyphens.
- `name` must be a non-empty string after trimming.
- The name length must be checked after trimming.
- `birthYear` must be an integer between 1000 and 2100.
- Numeric strings and decimal values are not valid birth years.
- Object and array values must not be accepted where strings or integers are expected.
- The API must not expose MongoDB's internal `_id` field.
- Author routes must use the custom `id` field.

### Database Index

Create a unique index on `authors.id`.

## 2.2 Relationship Between Authors and Books

Books reference authors through the book's `authorId` field.

Rules:

- An author may have multiple books.
- A book must reference an existing author.
- No reverse book-ID list is required on author documents.
- Related books can be found through the books collection using `authorId`.
- Deleting an author who is referenced by one or more books must be prevented.

## 2.3 Author Routes

### GET /authors

Purpose: Return all authors.

Success:
- `200 OK`
- Response body: an array of author objects.
- An empty array is valid when no authors exist.

Errors:
- `500 Internal Server Error` for unexpected errors.

### GET /authors/:id

Purpose: Retrieve one author using its custom ID.

Success:
- `200 OK`
- Response body: the matching author object.

Errors:
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` for unexpected errors.

### POST /authors

Purpose: Create a new author.

The request must have a JSON Content-Type header.

Example request:

    {
      "id": "a1",
      "name": "Chinua Achebe",
      "birthYear": 1930
    }

Success:
- `201 Created`
- Response body: the newly created author object.

Errors:
- `400 Bad Request` for missing or invalid fields.
- `400 Bad Request` if the author ID already exists.
- `415 Unsupported Media Type` if the request is not JSON.
- `500 Internal Server Error` for unexpected errors.

The API must explicitly handle MongoDB duplicate-key errors, including concurrent duplicate submissions.

### PUT /authors/:id

Purpose: Update an existing author.

Example request:

    {
      "name": "Updated Author Name",
      "birthYear": 1930
    }

Success:
- `200 OK`
- Response body: the updated author object.

Validation and processing order:
1. Check whether the author exists.
2. Return `404` if the author does not exist.
3. Validate the submitted fields.
4. Update the author.

Rules:
- The route ID determines which author is updated.
- Any `id` supplied in the request body must be ignored.
- The custom author ID must remain unchanged.
- The name must be trimmed before checking its length.
- `birthYear` must be an integer, not a numeric string or decimal.

Errors:
- `400 Bad Request` for invalid or missing fields.
- `404 Not Found` if the author does not exist.
- `415 Unsupported Media Type` if the request is not JSON.
- `500 Internal Server Error` for unexpected errors.

### DELETE /authors/:id

Purpose: Delete an author using its custom ID.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the author does not exist.
- `409 Conflict` if one or more books still reference the author.
- `500 Internal Server Error` for unexpected errors.

Example conflict response:

    {
      "error": "Cannot delete author a1 because 2 book(s) still reference this author."
    }

The API must count books referencing the author before deleting the author. The check and deletion should occur as close together as practical. A database transaction is not required for this assignment.

---

# Feature 3: Error Handling and Request Validation

## 3.1 Consistent Error Responses

All non-successful API responses must use this format:

    {
      "error": "Human-readable error message"
    }

Examples:

    {
      "error": "Book not found"
    }

    {
      "error": "Author not found"
    }

    {
      "error": "A book with this ID already exists"
    }

Unexpected server errors must return a generic message to the client. Actual error details should be logged on the server and not exposed in API responses.

## 3.2 Request Content-Type

POST and PUT requests must use JSON.

If a request uses an unsupported content type, return:

- `415 Unsupported Media Type`

## 3.3 Input Validation and Security

- Validate all required fields.
- Reject empty strings and invalid values.
- Reject objects and arrays where strings or integers are expected.
- Do not pass unvalidated request objects directly into MongoDB queries or update operations.
- Use only explicitly validated fields when inserting or updating documents.
- Do not allow clients to change custom IDs through PUT requests.

---

# Feature 4: Swagger Documentation

Swagger must document all book and author routes.

The documentation must include:

- GET, POST, PUT, and DELETE operations for books.
- GET, POST, PUT, and DELETE operations for authors.
- Book schema.
- Book input schema.
- Author schema.
- Author input schema.
- Shared error response schema.
- Required request fields and their validation rules.
- Request body examples.
- Successful response examples.
- Relevant error status codes and response examples.
- The `409 Conflict` response for attempts to delete an author who still has books.

The Swagger interface must be available at:

    /api-docs

Users must be able to test every API route through Swagger.

---

# Feature 5: Testing and Deployment

## 5.1 Local Testing

Test all book and author routes locally.

Confirm that:

- Books can be created, retrieved, updated, and deleted.
- Authors can be created, retrieved, updated, and deleted.
- Invalid requests return the correct status codes.
- Duplicate custom IDs are rejected.
- Books cannot reference nonexistent authors.
- Authors with existing books cannot be deleted.
- Successful delete operations return `204` without a response body.
- API responses do not expose MongoDB `_id`.
- Swagger documentation works at `/api-docs`.

## 5.2 Render Deployment

Deploy the completed API to Render.

Confirm that:

- The application connects to the configured MongoDB database.
- All book and author routes work on the deployed application.
- The deployed Swagger interface is available at `/api-docs`.
- Swagger can be used to test all routes.
- Environment variables and database credentials are kept out of the Git repository.

## 5.3 Completion Criteria

The Week 02 assignment is complete when:

1. Book CRUD operations work.
2. Author CRUD operations work.
3. Book-author references are validated.
4. Author deletion is protected when books reference that author.
5. Input validation and error handling work consistently.
6. All routes are documented in Swagger.
7. Local tests pass.
8. The deployed Render application works.