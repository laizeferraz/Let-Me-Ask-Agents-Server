# Let me Ask: Agents

A modern Node.js server application built with Fastify and PostgreSQL, designed for agent-based interactions.

## Tech Stack

- **Framework**: Fastify 5.4.0 with TypeScript
- **Database**: Docker and PostgreSQL with pgvector extension
- **ORM**: Drizzle ORM with migrations support
- **Validation**: Zod for schema validation
- **Code Quality**: Biome for linting and formatting
- **Development**: Node.js native TypeScript support (experimental strip types)

## Project Structure

The application follows a clean architecture pattern:

```
src/
├── db/
│   ├── connection.ts      # Database connection setup
│   ├── schema/           # Database schema definitions
│   ├── migrations/       # Database migrations
│   └── seed.ts          # Database seeding
├── http/
│   └── routes/          # API route handlers
├── env.ts               # Environment configuration
└── server.ts            # Application entry point
```

## Prerequisites

- Node.js 20+ (with experimental TypeScript support)
- Docker and Docker Compose
- PostgreSQL (via Docker)

## Setup Instructions

### 1. Repository Setup

Start the PostgreSQL database with pgvector extension:

```bash
git clone <repository-url>
cd server
```

### 2. Database Setup

Start the PostgreSQL database with pgvector extension:

```bash
docker-compose up -d
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```env
PORT=3333
DB_URL=postgresql://docker:docker@localhost:5432/agents
```

### 4. Database Migration

Run database migrations:

```bash
npx drizzle-kit migrate
```

### 5. Seed Database (Optional)

Populate the database with initial data:

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3333` with hot reload enabled.

## Available Scripts

- `npm run dev` - Start development server with watch mode
- `npm start` - Start production server
- `npm run db:seed` - Seed database with initial data
- `npx drizzle-kit generate` - Generate new migrations
- `npx drizzle-kit migrate` - Run pending migrations

## API Testing

Use the `client.http` file to test API endpoints directly in VS Code with the REST Client extension:

- Health check: `GET /health`
- Get rooms: `GET /rooms`

## Database Configuration

The application uses Drizzle ORM with PostgreSQL:

- **Dialect**: PostgreSQL
- **Schema**: Located in `src/db/schema/`
- **Migrations**: Auto-generated in `src/db/migrations/`
- **Naming Convention**: snake_case

## Development Notes

- TypeScript is handled natively by Node.js (experimental feature)
- CORS is enabled for cross-origin requests
- Environment variables are validated using Zod schemas
- Database uses pgvector extension for vector operations
