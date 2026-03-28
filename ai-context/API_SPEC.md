# API Specification

## Authentication

POST /register

Body:

{
  "name": "string",
  "email": "string",
  "password": "string"
}

Response:

201 Created


POST /login

Body:

{
  "email": "string",
  "password": "string"
}

Response:

{
  "token": "JWT"
}

---

## Tasks

GET /tasks  
POST /tasks  
PUT /tasks/:id  
DELETE /tasks/:id

Body example:

{
  "title": "string",
  "description": "string"
}

Rules:

- user must be authenticated
- tasks belong to user_id
