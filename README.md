# NotesAPI

This API provides functionality for user authentication and managing user-specific notes. Each endpoint requires proper authentication (via Bearer token) except for signup and login.

---

## Base URL
```plaintext
https://6z1dkbol4e.execute-api.eu-north-1.amazonaws.com/dev/api/
```
---

## Endpoints

### 1. User Signup

- **Endpoint:** `POST /api/user/signup`
- **Description:** Create a new user account.
- **Request Body (JSON):**
```plaintext
  {
    "username": "your-username",
    "password": "your-password"
  }
```
- **Response:**
  - `201 Created`: User successfully created.
  - `400 Bad Request`: Missing or invalid input.

---

### 2. User Login

- **Endpoint:** `POST /api/user/login`
- **Description:** Authenticate a user and receive a token.
- **Request Body (JSON):**
```plaintext
  {
    "username": "your-username",
    "password": "your-password"
  }
```

- **Response:**
  - `200 OK`: Returns a token.
```plaintext
    {
      "token": "your-jwt-token"
    }
```
  - `401 Unauthorized`: Invalid username or password.

---

### 3. Get Notes

- **Endpoint:** `GET /api/notes`
- **Description:** Fetch all notes for the currently logged-in user.
- **Headers:**
  Authorization: Bearer <your-token>
- **Response:**
  - `200 OK`: Returns an array of notes.
```plaintext
    [
      {
        "id": "note-id",
        "username": "your-username",
        "title": "My Note",
        "text": "Note content",
        "createdAt": "2024-11-27T10:00:00.000Z",
        "modifiedAt": "2024-11-27T10:00:00.000Z"
      }
    ]
```
  - `401 Unauthorized`: Missing or invalid token.

---

### 4. Create Note

- **Endpoint:** `POST /api/notes`
- **Description:** Create a new note for the currently logged-in user.
- **Headers:**
  Authorization: Bearer <your-token>
- **Request Body (JSON):**
```plaintext
  {
    "title": "My Note",
    "text": "Note content"
  }
```

- **Response:**
  - `201 Created`: Returns the newly created note.
  - `400 Bad Request`: Invalid input.
  - `401 Unauthorized`: Missing or invalid token.

---

### 5. Update Note

- **Endpoint:** `PUT /api/notes`
- **Description:** Update an existing note for the currently logged-in user.
- **Headers:**
  Authorization: Bearer <your-token>
- **Request Body (JSON):**
  {
    "id": "note-id",
    "title": "Updated Title",
    "text": "Updated content"
  }
- **Response:**
  - `200 OK`: Returns the updated note.
  - `400 Bad Request`: Invalid input.
  - `401 Unauthorized`: Missing or invalid token.
  - `404 Not Found`: Note not found or not owned by the user.

---

### 6. Delete Note

- **Endpoint:** `DELETE /api/notes`
- **Description:** Delete an existing note for the currently logged-in user.
- **Headers:**
  Authorization: Bearer <your-token>
- **Request Body (JSON):**
```plaintext

  {
    "id": "note-id"
  }

```
- **Response:**
  - `200 OK`: Note successfully deleted.
  - `400 Bad Request`: Invalid input.
  - `401 Unauthorized`: Missing or invalid token.
  - `404 Not Found`: Note not found or not owned by the user.

---

## Authorization

Most endpoints require a Bearer token. Include the token in the `Authorization` header:
Authorization: Bearer <your-token>

Tokens are generated via the `/api/user/login` endpoint and are valid for 1 hour.

---

## Error Handling

- `200 OK`: Request succeeded.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Invalid or missing input.
- `401 Unauthorized`: Missing or invalid token.
- `404 Not Found`: Resource not found or not accessible.
- `500 Internal Server Error`: An unexpected error occurred.
