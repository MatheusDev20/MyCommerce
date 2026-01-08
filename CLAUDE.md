# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyCommerce is a monorepo e-commerce backend application built with NestJS following Domain-Driven Design (DDD) and CQRS patterns. The project uses Turborepo for monorepo orchestration, Prisma as the ORM, and PostgreSQL as the database.

## Monorepo Structure

- **apps/server**: Main NestJS backend application
- **packages/db**: Shared Prisma database package with schema and migrations
- **packages/eslint-config**: Shared ESLint configuration
- **packages/typescript-config**: Shared TypeScript configurations

## Common Commands

### Development
```bash
# Start all applications in development mode
npm run dev

# Start server only (from root)
turbo dev --filter=@repo/server

# Start server directly (from apps/server)
npm run dev
```

### Database Operations
```bash
# Generate Prisma client (must run after schema changes)
turbo db:generate

# Create and apply a new migration (development)
cd packages/db && npm run db:migrate

# Apply migrations to production database
cd packages/db && npm run db:deploy
```

### Building
```bash
# Build all packages and apps
npm run build

# Build server only
turbo build --filter=@repo/server
```

### Testing
```bash
# Run tests (from apps/server)
cd apps/server && npm test

# Run tests in watch mode
cd apps/server && npm run test:watch

# Run e2e tests
cd apps/server && npm run test:e2e

# Run tests with coverage
cd apps/server && npm run test:cov
```

### Linting and Formatting
```bash
# Lint all packages
npm run lint

# Format code
npm run format
```

### Infrastructure
```bash
# Start local Docker environment
npm run docker:dev

# Deploy to AWS (uses Terraform)
cd apps/server && npm run deploy
```

## Architecture Patterns

### CQRS (Command Query Responsibility Segregation)

The application strictly separates commands (writes) from queries (reads):

- **Commands**: Located in `modules/{module}/commands/` - handle state mutations (create, edit, delete)
- **Queries**: Located in `modules/{module}/query/` - handle data retrieval
- All commands and queries flow through NestJS CQRS `CommandBus` and `QueryBus`

### DDD Building Blocks

**Base Classes (in `src/libs/`)**:
- `Entity<T>`: Base class for domain entities with identity, timestamps, and validation
- `Command`: Base class for commands with metadata (id, userId, timestamp)
- `Query`: Base class for queries with metadata
- `ValueObject`: Base class for value objects (immutable domain concepts)

**Repository Pattern**:
- Repository interfaces defined in `src/libs/ports/repository.port.ts`
- Concrete implementations in `modules/{module}/db/{entity}/` directories
- Repositories are injected using string tokens (e.g., `'UserRepository'`, `'ProductRepository'`)

### Module Structure

Each domain module follows this structure:
```
modules/{module}/
├── commands/          # Command handlers (write operations)
│   ├── create/
│   │   ├── command.ts    # Command definition (extends Command)
│   │   ├── handler.ts    # CommandHandler implementation
│   │   └── controller.ts # HTTP controller
│   ├── edit/
│   └── delete/
├── query/             # Query handlers (read operations)
│   └── profile/
│       ├── command.ts    # Query definition (extends Query)
│       ├── handler.ts    # QueryHandler implementation
│       └── controller.ts # HTTP controller
├── db/                # Data access layer
│   └── {entity}/
│       └── {entity}-repository.ts
├── domain/            # Domain models
│   ├── {entity}.entity.ts  # Entity class
│   ├── {entity}.type.ts    # Type definitions
│   └── vo/                 # Value objects
├── schemas/           # Zod validation schemas
└── {module}.module.ts # NestJS module configuration
```

### Validation

- Request validation uses **Zod** schemas with a custom `ZodPipe`
- Schemas are defined in `modules/{module}/schemas/`
- Applied in controllers via `@Body(new ZodPipe(schema))`

### Routing

- API routes are centralized in `src/configs/app.routes.ts`
- Current version: `/api/v1`
- Controllers reference routes using `routesV1.{module}.{action}`

### Authentication

- JWT-based authentication with refresh tokens
- Auth module provides `Hashing` port (implemented with bcrypt)
- Session management via `RefreshToken` database model
- Cookies handled by `CookieService`

### Database

- **ORM**: Prisma with PostgreSQL
- **Schema location**: `packages/db/prisma/schema.prisma`
- **Generated client**: `packages/db/generated/prisma` (imported as `@repo/db`)
- **Models**: User, Address, Product, ProductImage, RefreshToken

**After modifying the Prisma schema**:
1. Create migration: `cd packages/db && npm run db:migrate`
2. Regenerate client: `turbo db:generate`

### Dependency Injection

NestJS modules use provider tokens for abstraction:
- Repositories: `'UserRepository'`, `'ProductRepository'`, `'SessionRepository'`
- Services: `'Hashing'` (password hashing)
- Inject using `@Inject('TokenName')`

### HTTP Responses

Standard responses from `src/shared/http/common-responses`:
- `ok(data)`: Success response wrapper
- Type: `HttpResponse<T>`

### Request Context

- `AsyncLocalStorage` used for request-scoped context (e.g., request IDs)
- Accessible in commands/queries via `asyncLocalStorage.getStore()`
- Managed by `RequestInterceptor`

## Current Modules

- **User**: User management with CRUD operations, profile queries, authentication
- **Product**: Product catalog management
- **Auth**: Authentication, login, token refresh

## Technology Stack

- **Runtime**: Node.js >= 18
- **Framework**: NestJS 11
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod + class-validator
- **Testing**: Jest (unit), jest-cucumber (BDD), supertest (e2e)
- **Caching**: @nestjs/cache-manager
- **Rate Limiting**: @nestjs/throttler (global: 10 req/60s)
- **Infrastructure**: AWS Lambda (serverless-express), Terraform

## Development Notes

- TypeScript strict mode enabled (`exactOptionalPropertyTypes`, `strictNullChecks`)
- Turbo caching configured for builds and lints
- Database migrations run automatically before builds via `turbo.json` dependencies
- Lambda deployment scripts in `apps/server/iac/terraform/`
