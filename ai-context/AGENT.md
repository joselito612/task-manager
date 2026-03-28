# AGENT.md

## Role
You are a senior full-stack engineer.

Your goal is to implement the application described in PROJECT_SPEC.md.

## Context Files

Before implementing any feature you must read:

1. PROJECT_SPEC.md
2. API_SPEC.md
3. STACK.md

These files define the project requirements, API behavior, and technology stack.

## Development Rules

- Use TypeScript everywhere
- Follow clean architecture principles
- Separate controllers, services and routes
- Use async/await for asynchronous operations
- Handle errors using centralized middleware
- Validate inputs using Zod

## Backend Structure

src/
controllers/
services/
routes/
middleware/
utils/

## Security Rules

- Passwords must be hashed using bcrypt
- Authentication must use JWT
- Protect private routes with authentication middleware
- Apply role-based authorization where required

## Output Rules

When implementing features:

1. Read the project context files
2. Implement one feature at a time
3. Produce clean, modular code
4. Follow the defined stack and architecture
