# MyCommerce - Repository Overview

## Table of Contents
1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Code Organization](#code-organization)
5. [Key Directories](#key-directories)
6. [Testing Approach](#testing-approach)
7. [Build & Tooling](#build--tooling)
8. [Design Patterns](#design-patterns)

---

## Project Structure

MyCommerce is a **monorepo** managed by **Turborepo** with the following high-level structure:

```
MyCommerce/
├── apps/
│   └── server/              # NestJS backend application
├── packages/
│   ├── db/                  # Prisma database package
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configurations
├── turbo.json              # Turborepo configuration
└── package.json            # Workspace root
```

---

## Technology Stack

### Backend Framework
- **NestJS 11.x** - Primary backend framework with decorators and dependency injection
- **Node.js >= 18** - Runtime environment
- **TypeScript 5.5.4** - Programming language

### Database & ORM
- **Prisma 6.16.3** - Database ORM with custom output directory
- **PostgreSQL** - Database (via Docker Compose)
- **@prisma/extension-accelerate** - Prisma performance extension

### CQRS & Architecture
- **@nestjs/cqrs 11.x** - Command Query Responsibility Segregation pattern
- Command handlers for write operations
- Query handlers for read operations

### Authentication & Security
- **@nestjs/jwt** - JWT token generation
- **bcrypt 6.0.0** - Password hashing
- **cookie-parser** - Cookie management
- **@nestjs/throttler** - Rate limiting

### Validation
- **Zod 3.23.8** - Schema validation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

### Infrastructure
- **Turbo 2.2.3** - Monorepo build system
- **Docker Compose** - PostgreSQL containerization
- **AWS/Terraform** - Infrastructure as Code

### Testing
- **Jest 29.x** - Testing framework
- **jest-cucumber 4.5.0** - BDD-style testing
- **Supertest** - HTTP integration testing

### Utilities
- **Axios** - HTTP client
- **Cache-manager** - Caching
- **UUID** - ID generation
- **Knex** - Additional query builder

---

## Architecture Patterns

### Domain-Driven Design (DDD) with CQRS

MyCommerce implements a sophisticated **Domain-Driven Design** architecture combined with **CQRS** (Command Query Responsibility Segregation).

#### Tactical DDD Patterns

**1. Entities** (`/apps/server/src/libs/entity.base.ts`)
- Base Entity class with ID, createdAt, updatedAt
- Validation hooks
- Equality comparison
- Immutable props via `getProps()`
- Examples: User, Address, Product entities

**2. Value Objects**
- ZipCode validation (`/apps/server/src/modules/user/domain/vo/zip-code.ts`)
- Encapsulates domain rules

**3. Aggregate Roots**
- User aggregate with Address child entities
- Product aggregate with ProductImage child entities

**4. Domain Events** (via CQRS)
- Command pattern for state changes
- Query pattern for data retrieval

#### CQRS Implementation

Commands follow a structured pattern:

```
commands/
  ├── create-user/
  │   ├── command.ts      # Command definition
  │   ├── handler.ts      # Business logic
  │   └── controller.ts   # HTTP endpoint
```

Base Command class includes:
- Request ID tracking
- User ID tracking
- Timestamp tracking
- Correlation via AsyncLocalStorage

#### Layered Architecture

Each module follows a clean layered structure:

```
Module Structure (e.g., User Module):
├── commands/           # Write operations (CQRS)
├── query/             # Read operations (CQRS)
├── domain/            # Domain entities & value objects
│   ├── *.entity.ts
│   └── vo/
├── db/                # Infrastructure/Persistence layer
│   ├── user/
│   │   └── user-repository.ts
│   └── address/
├── schemas/           # Zod validation schemas
├── ports/             # Interfaces/Contracts
└── infra/            # Infrastructure implementations
```

#### Repository Pattern (Hexagonal Architecture)

Port/Adapter pattern implementation:
- **Port**: `/apps/server/src/libs/ports/repository.port.ts`
- **Adapter**: `/apps/server/src/modules/user/db/user/user-repository.ts`
- Dependency injection via string tokens (e.g., `'UserRepository'`)

#### Mapper Pattern

Domain-to-Persistence mapping:
- Location: `/apps/server/src/modules/user/user.mapper.ts`
- `toPersistence()` - Entity → Prisma format
- `toDomain()` - Prisma → Entity (rehydration)

---

## Code Organization

### Module Organization (NestJS)

Each domain module follows a consistent structure:

```
modules/
├── user/
│   ├── commands/         # Write side
│   ├── query/           # Read side
│   ├── domain/          # Domain layer
│   ├── db/              # Persistence
│   ├── schemas/         # Validation
│   ├── user.module.ts   # Module definition
│   └── user.mapper.ts   # Mapping logic
├── auth/
├── product/
└── http/               # Shared HTTP utilities
```

### Shared Libraries (`/libs/`)

- `entity.base.ts` - Base entity abstraction
- `command.ts` - Command base class with metadata
- `query.base.ts` - Query base class
- `async-local-storage.ts` - Request context tracking
- `request-interceptor.ts` - Request ID injection
- `ports/repository.port.ts` - Repository interfaces

### Configuration Management

- `/apps/server/src/configs/app.routes.ts` - Centralized route definitions with versioning
- `/apps/server/src/config/` - Database and environment config
- Global ConfigModule with environment variables

### Validation Strategy

- Zod schemas in `/schemas/` directories
- Custom ZodPipe: `/apps/server/src/pipes/zod.ts`
- Applied at controller level via decorators

### Response Standardization

Common response helpers (`/apps/server/src/shared/http/common-responses.ts`):
- `ok()`, `created()`, `updated()`, `deleted()`, `authenticated()`
- Consistent response structure with statusCode and body

---

## Key Directories

### Application Layer
**`/apps/server/src/`** - Main application source (60 TypeScript files)
- `/modules/` - Domain modules (user, auth, product, http, logger)
- `/libs/` - Shared abstractions and utilities
- `/configs/` - Configuration files
- `/shared/` - Shared utilities (HTTP filters, exceptions)
- `/prisma/` - Prisma service wrapper
- `/pipes/` - Custom validation pipes
- `/utils/` - Helper utilities (Guard, props-to-objects)
- `main.ts` - Application bootstrap

### Infrastructure Layer
**`/apps/server/iac/terraform/`** - Terraform IaC for AWS deployment
- Contains: backend.tf, main.tf, variables.tf, outputs.tf

### Database Package
**`/packages/db/`** - Shared Prisma client
- `/prisma/schema.prisma` - Database schema
- `/prisma/migrations/` - Database migrations
- `/generated/prisma/` - Generated Prisma client
- `index.ts` - Package exports

### Configuration Packages
- **`/packages/eslint-config/`** - Shared linting rules
- **`/packages/typescript-config/`** - Shared TS configs (base, nest, nextjs, react-library)

### Testing
**`/apps/server/test/`** - E2E and BDD tests
- `/user/create-user/` - BDD feature files and specs

---

## Testing Approach

### BDD (Behavior-Driven Development)

Uses **jest-cucumber** for Gherkin-style tests:

```gherkin
Feature: Create a user
    Scenario: I can create a user
        Given user profile data
        When I send a request to create a user
        Then I receive my user ID
        And I can see my user in a list of all users
```

**Location**: `/apps/server/test/user/create-user/create-user.feature`

### E2E Testing

- Configuration: `/apps/server/test/jest-e2e.json`
- Pattern: `.e2e-spec.ts$`
- Uses Supertest for HTTP assertions

### Unit Testing

- Jest configuration with ts-jest transformer
- Test files: `*.spec.ts`

### Test Scripts

```bash
npm run test          # Run unit tests
npm run test:watch    # Watch mode
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage reports
```

---

## Build & Tooling

### Turborepo Configuration

The monorepo uses Turborepo for efficient task management:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**"],
      "env": ["DATABASE_URL"]
    },
    "dev": { "persistent": true, "cache": false },
    "db:generate": { "cache": false },
    "db:migrate": { "cache": false },
    "docker:dev": { "persistent": true }
  }
}
```

### TypeScript Configuration

**Base config** (`/packages/typescript-config/base.json`):
- Strict mode enabled
- ES2022 target
- NodeNext module resolution
- Declaration maps

**NestJS config** extends base with:
- Experimental decorators
- Emit decorator metadata
- CommonJS modules

### Build Pipeline

1. **Database Generation**: Prisma generate creates client before build
2. **NestJS Build**: Uses Nest CLI with tsconfig compilation (output: `/apps/server/dist/`)
3. **Package Building**: DB package uses `tsup` for bundling

### Development Scripts

```bash
npm run dev           # Start dev server with watch mode
npm run docker:dev    # Start PostgreSQL container
npm run build         # Production build
npm run lint          # ESLint with auto-fix
npm run format        # Prettier formatting
npm run deploy        # Deploy to AWS
```

### Docker Setup

Docker Compose for PostgreSQL:
- PostgreSQL latest
- Environment variables from .env
- Port 5432 exposed
- Persistent volume (pgdata)

### Deployment

- Terraform scripts in `/iac/terraform/`
- AWS Lambda support
- AWS Serverless Express integration

---

## Design Patterns

### 1. Dependency Injection (Port/Adapter - Hexagonal Architecture)

```typescript
// Port (Interface)
export interface UserRepository { ... }

// Provider registration
{
  provide: 'UserRepository',
  useClass: PrismaUserRepository,
}

// Constructor Injection
constructor(
  @Inject('UserRepository') private readonly userRepository: UserRepository,
)
```

### 2. Request Context Pattern

AsyncLocalStorage for request tracking:
- Stores requestId across async operations
- Used in Command metadata
- Implementation: `/apps/server/src/libs/async-local-storage.ts`

### 3. Factory Pattern

Entity creation patterns:

```typescript
// Create new entity
static create(props): Entity {
  return new Entity({ id: randomUUID(), props });
}

// Rehydrate from persistence
static rehydrate(raw): Entity {
  return new Entity({ id: raw.id, createdAt: raw.createdAt, ... });
}
```

### 4. Guard Pattern

Utility guards for validation:
- `isEmpty()` - Comprehensive empty checks
- `lengthIsBetween()` - Length validation
- Location: `/apps/server/src/utils/guard.ts`

### 5. Global Module Pattern

PrismaModule marked as `@Global()`:
- Single database connection
- Available across all modules
- No need for repeated imports

### 6. Module Isolation with Circular Dependencies

Using `forwardRef()` for circular dependencies:

```typescript
imports: [forwardRef(() => AuthModule)]
```

### 7. Middleware & Interceptors

- Global ValidationPipe
- Global HttpExceptionFilter
- RequestInterceptor for context tracking
- ThrottlerGuard for rate limiting
- Cookie parser middleware

### 8. API Versioning

Centralized versioning:

```typescript
export const routesV1 = {
  version: '/api/v1',
  user: { root: 'users', ... },
  auth: { root: 'auth' },
  product: { root: 'products' }
}
```

### 9. Security Patterns

**Password Hashing**:
- Bcrypt with configurable salt rounds
- Separate salts for passwords (12) vs refresh tokens (16)

**JWT Strategy**:
- Short-lived access tokens (60 seconds)
- Long-lived refresh tokens (7 days)
- HttpOnly cookies with secure flags

**CORS Configuration**:
- Environment-based (production vs local)
- Credentials support for local development

### 10. Error Handling

- Custom HttpExceptionFilter
- Structured error responses with timestamp and path
- Consistent 500 fallback

### 11. Entity Invariants

Abstract `validate()` method on entities:
- Called on construction and before persistence
- Enforces domain rules
- Example: Address street length validation

---

## Summary

**MyCommerce** is a well-architected e-commerce backend implementing:

1. **DDD + CQRS** for domain modeling and separation of concerns
2. **Hexagonal Architecture** via ports and adapters
3. **Monorepo** structure with shared packages
4. **Type-safe** development with TypeScript and Zod
5. **Modern testing** with BDD and E2E approaches
6. **Production-ready** infrastructure with Docker, Terraform, and AWS Lambda support
7. **Security-focused** authentication with JWT and bcrypt
8. **Scalable** patterns with request context, caching, and rate limiting

The codebase demonstrates enterprise-level patterns while maintaining clarity and maintainability through consistent organization and strong typing.
