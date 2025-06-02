# Blog API Server

A RESTful API server for a blogging platform, built with [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), and PostgreSQL.

## Features

- **Authentication**: JWT-based registration and login
- **Users**: Profile management, password change, role-based access
- **Posts**: CRUD, search, pagination, tagging, categories, view count
- **Categories & Tags**: CRUD, admin-only management, search, popular tags
- **Comments**: Nested comments, replies, edit/delete, pagination
- **Testing**: E2E tests with Jest and Supertest
- **Database**: Prisma migrations, factories, and seeding

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Docker (for local PostgreSQL)
- npm

### Setup

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd server
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.test` to `.env` and adjust as needed:

   ```sh
   cp .env.test .env
   ```

4. **Start PostgreSQL with Docker**

   ```sh
   npm run db:dev:up
   ```

5. **Run Prisma migrations**

   ```sh
   npm run prisma:dev:deploy
   ```

6. **Seed the database (optional)**

   ```sh
   npm run prisma:seed
   ```

### Running the Server

```sh
npm run start:dev
```

API will be available at `http://localhost:3000/api`

### Running Tests

- **E2E tests** (uses test DB):

  ```sh
  npm run test:e2e
  ```

- **Unit tests**:

  ```sh
  npm test
  ```

## API Overview

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and get JWT
- `GET /users` — List users (with pagination, search)
- `GET /posts` — List posts (with filters, pagination)
- `POST /posts` — Create post (auth required)
- `PATCH /posts/:id` — Update post (author only)
- `DELETE /posts/:id` — Delete post (author only)
- `GET /categories` — List categories
- `POST /categories` — Create category (admin only)
- `GET /tags` — List tags
- `POST /tags` — Create tag (auth required)
- `GET /comments` — List comments (with filters)
- `POST /comments` — Add comment (auth required)

See source code for full details.

## Project Structure

- `src/` — Main application code
- `prisma/` — Prisma schema, migrations, factories, seed
- `test/` — E2E tests and test utilities

## Development Scripts

- `npm run start:dev` — Start server in watch mode
- `npm run test:e2e` — Run E2E tests
- `npm run prisma:migrate` — Run new migrations
- `npm run prisma:seed` — Seed the database

## License

UNLICENSED

---

**Test Credentials (from seed):**

- Admin: `admin@blog.com` / `admin123`
- Test User: `test@blog.com` / `test123`