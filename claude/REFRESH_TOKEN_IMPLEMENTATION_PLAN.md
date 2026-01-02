# Refresh Token Flow - Implementation Plan

## Current State ✅

You've already implemented most of the foundation:

1. ✅ **Login creates both tokens** - Access token (60s) + Refresh token (7 days)
2. ✅ **Tokens stored as HTTP-only cookies** - Secure, sameSite protected
3. ✅ **Refresh tokens hashed in database** - Using bcrypt salt 16
4. ✅ **RefreshToken model in Prisma** - With user relation and expiration
5. ✅ **Session repository** - Saves hashed refresh tokens
6. ✅ **Cookie service** - Sets and clears both tokens
7. ✅ **JWT tools** - Generate access + refresh tokens

**Missing**: The refresh endpoint and handler to validate and renew tokens.

---

## Implementation Plan

### Step 1: Create Refresh Token Command

**Location**: `/apps/server/src/modules/auth/commands/refresh-token/`

Create these files:
```
refresh-token/
├── command.ts       # Define RefreshTokenCommand
├── handler.ts       # Business logic to validate and generate new tokens
└── controller.ts    # HTTP endpoint
```

**Command Properties**:
```typescript
class RefreshTokenCommand {
  refreshToken: string;  // From cookie
}
```

---

### Step 2: Implement Refresh Token Handler

**File**: `/apps/server/src/modules/auth/commands/refresh-token/handler.ts`

**Logic Flow**:

```
1. Extract refresh token from request cookie
   ↓
2. Validate token exists
   ↓
3. Query database for ALL refresh tokens for potential users
   (You'll need to check which one matches via bcrypt)
   ↓
4. For each stored token:
   - Use bcrypt.compare(providedToken, storedHashedToken)
   - Find the matching one
   ↓
5. Check if token has expired (expiresAt < now)
   ↓
6. Get the associated user from the token
   ↓
7. Verify user still exists and is active
   ↓
8. Generate NEW access token (60s expiration)
   ↓
9. (Optional) Generate NEW refresh token and invalidate old one
   ↓
10. Save new refresh token to database (if rotating)
    ↓
11. Set new tokens as cookies
    ↓
12. Return success
```

**Key Challenge**:
Since refresh tokens are hashed, you can't query by token directly. Options:

**Option A** (Current approach):
- Query all refresh tokens
- Use bcrypt.compare() on each until you find a match
- ⚠️ Inefficient if many users

**Option B** (Better - requires schema change):
- Add `tokenId` field to refresh token
- Store both tokenId (indexed) and hashedToken
- Query by tokenId, then verify hash
- More efficient

**Option C** (Best - requires schema change):
- Add `userId` to the refresh token payload (JWT)
- Decode token to get userId (without verifying)
- Query refresh tokens for that user only
- Compare with bcrypt

---

### Step 3: Add SessionRepository Methods

**File**: `/apps/server/src/modules/auth/db/session/session-repository.ts`

Add these methods:

```typescript
interface SessionRepository {
  save(token: string, user: User): Promise<void>;  // ✅ Already exists

  // NEW methods needed:
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<number>;  // Cleanup job
}
```

**Note**: `findByToken()` will need to:
- Get all tokens (or filter by user if using Option C)
- Compare with bcrypt until match found

---

### Step 4: Create Refresh Endpoint

**File**: `/apps/server/src/modules/auth/commands/refresh-token/controller.ts`

**Endpoint**: `POST /api/v1/auth/refresh`

**Flow**:
```typescript
1. Extract refresh_token from cookies
2. If no token → throw UnauthorizedException
3. Execute RefreshTokenCommand
4. Return new access_token (or both tokens if rotating)
```

**No auth guard needed** - endpoint uses refresh token from cookie.

---

### Step 5: Update Auth Module

**File**: `/apps/server/src/modules/auth/auth.module.ts`

Register:
- RefreshTokenHandler (CommandHandler)
- RefreshTokenController

---

### Step 6: Create JWT Auth Guard (For Protected Routes)

**Location**: `/apps/server/src/modules/auth/guards/jwt-auth.guard.ts`

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Validates JWT from access_token cookie
  // Throws UnauthorizedException if invalid/expired
}
```

**Usage**: Apply to protected routes
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return req.user;
}
```

---

### Step 7: Configure JWT Strategy

**Location**: `/apps/server/src/modules/auth/strategies/jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        // Extract JWT from access_token cookie
        return req?.cookies?.access_token;
      },
      secretOrKey: JWT_CONSTANTS.secret,
    });
  }

  async validate(payload: any) {
    // Return user info from JWT payload
    return { userId: payload.sub, ...payload };
  }
}
```

---

### Step 8: Implement Logout

**Location**: `/apps/server/src/modules/auth/commands/logout/`

**Logic**:
```
1. Extract refresh_token from cookie
2. Delete refresh token from database
3. Clear both cookies (access_token + refresh_token)
4. Return success
```

**Endpoint**: `POST /api/v1/auth/logout`

---

### Step 9: Add Cleanup Job (Optional but Recommended)

**Location**: `/apps/server/src/modules/auth/jobs/cleanup-expired-tokens.job.ts`

```typescript
@Cron('0 0 * * *')  // Daily at midnight
async cleanupExpiredTokens() {
  const deleted = await sessionRepository.deleteExpired();
  console.log(`Deleted ${deleted} expired refresh tokens`);
}
```

---

## Recommended Implementation Order

### Phase 1: Basic Refresh (Minimal)
1. Add `findByUserId()` to SessionRepository
2. Create RefreshTokenCommand
3. Create RefreshTokenHandler (validate + generate new access token)
4. Create RefreshTokenController
5. Register in auth module
6. Test with existing login

### Phase 2: Auth Guards
1. Create JwtStrategy
2. Create JwtAuthGuard
3. Apply guard to protected routes (user profile, orders, etc.)
4. Test protected routes

### Phase 3: Logout
1. Create LogoutCommand/Handler
2. Create LogoutController
3. Test full flow: login → access protected route → logout → can't access

### Phase 4: Token Rotation (Optional)
1. Update RefreshTokenHandler to generate new refresh token
2. Delete old refresh token
3. Save new refresh token
4. Return both tokens

### Phase 5: Cleanup
1. Add cleanup job
2. Add `deleteExpired()` to repository
3. Schedule daily cleanup

---

## Database Schema Recommendation

**Current Schema**:
```prisma
model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique      // Hashed token
  createdAt DateTime @default(now())
  expiresAt DateTime
  @@map("refresh_tokens")
}
```

**Recommended Addition** (for efficiency):
```prisma
model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  tokenId   String   @unique      // ← NEW: Unhashed identifier
  token     String                // Hashed token
  createdAt DateTime @default(now())
  expiresAt DateTime

  @@index([userId])                // ← NEW: Faster user lookup
  @@index([expiresAt])             // ← NEW: Faster cleanup
  @@map("refresh_tokens")
}
```

**Why**:
- `tokenId` - Query by this, then verify hash (faster)
- `userId` index - Find all user tokens quickly
- `expiresAt` index - Cleanup job performance

---

## Testing Strategy

### Manual Test Flow
```bash
# 1. Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
# → Receives access_token + refresh_token cookies

# 2. Wait 60+ seconds (access token expires)

# 3. Try protected route (should fail)
GET /api/v1/users/profile
# → 401 Unauthorized

# 4. Refresh tokens
POST /api/v1/auth/refresh
# → New access_token returned

# 5. Try protected route again (should work)
GET /api/v1/users/profile
# → 200 OK with user data

# 6. Logout
POST /api/v1/auth/logout
# → Cookies cleared, tokens deleted

# 7. Try refresh (should fail)
POST /api/v1/auth/refresh
# → 401 Unauthorized
```

### Automated Tests
1. **E2E test**: Full login → refresh → logout flow
2. **Unit test**: RefreshTokenHandler validates expired tokens
3. **Unit test**: RefreshTokenHandler rejects invalid tokens
4. **Unit test**: Logout deletes token from database

---

## Security Considerations

### ✅ Already Implemented
- Refresh tokens hashed before storage (bcrypt salt 16)
- HTTP-only cookies (no JavaScript access)
- Secure flag (HTTPS only)
- SameSite protection (CSRF)
- Short access token lifetime (60s)
- Long refresh token lifetime (7 days)

### 🔧 Need to Add
- **Token rotation**: Generate new refresh token on each refresh
- **Single-use tokens**: Delete old token after refresh
- **Device tracking**: Optional - track which device/IP uses token
- **Revocation**: Logout invalidates tokens
- **Cleanup job**: Remove expired tokens from database

### 🚨 Fix Before Production
- **Secret in environment variable**: Move `JWT_CONSTANTS.secret` to `.env`
- **Stronger secret**: Use 256-bit random string
- **HTTPS enforcement**: Ensure `secure: true` in production
- **Rate limiting**: Prevent brute-force on refresh endpoint

---

## Client-Side Flow (Frontend Consideration)

Your frontend should:

```javascript
// 1. API request fails with 401
fetch('/api/v1/users/profile')
  .catch(async (err) => {
    if (err.status === 401) {
      // 2. Try to refresh
      const refreshed = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        credentials: 'include'  // Send cookies
      });

      if (refreshed.ok) {
        // 3. Retry original request
        return fetch('/api/v1/users/profile');
      } else {
        // 4. Redirect to login
        window.location.href = '/login';
      }
    }
  });
```

Or use axios interceptor for automatic retry.

---

## Summary

**You have**: 90% of the infrastructure ✅
**You need**:
1. Refresh endpoint + handler (validate token, generate new access token)
2. JWT guards for protected routes
3. Logout endpoint
4. Repository query methods

**Start with**:
- Step 1-5 (Refresh endpoint)
- Test it works
- Then add guards, logout, cleanup

Your architecture is solid - just need to connect the pieces!
