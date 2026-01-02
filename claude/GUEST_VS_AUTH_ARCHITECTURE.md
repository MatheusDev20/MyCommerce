# Guest vs Authenticated Shopping Architecture

## User Journey Flows

### Flow 1: Guest Shopping → Login at Checkout
```
1. User visits site (anonymous)
   → Session ID created: session_abc123

2. Browse products
   → GET /api/v1/products (NO AUTH)
   → GET /api/v1/products/:id (NO AUTH)

3. Add to cart
   → POST /api/v1/cart/items (NO AUTH)
   → Uses session ID from cookie
   → Cart stored with sessionId: "session_abc123"

4. Go to checkout
   → GET /api/v1/cart (NO AUTH, returns session cart)
   → User prompted: "Login or Continue as Guest"

5. User logs in
   → POST /api/v1/auth/login
   → Returns JWT token
   → Backend merges session cart → user cart
   → Session cart deleted

6. Complete checkout
   → POST /api/v1/orders (AUTH REQUIRED)
   → Uses merged cart + saved address
```

### Flow 2: Registered User Shopping
```
1. User logs in
   → POST /api/v1/auth/login
   → Returns JWT token + sets httpOnly cookie

2. Browse products
   → GET /api/v1/products (optional auth)
   → If authenticated: can show "favorited" status

3. Add to cart
   → POST /api/v1/cart/items (AUTH)
   → Cart saved to userId in database
   → Cart persists across devices

4. Checkout
   → GET /api/v1/cart (AUTH)
   → GET /api/v1/users/addresses (AUTH)
   → POST /api/v1/orders (AUTH)
```

### Flow 3: Guest Checkout (No Account)
```
1-3. Same as Flow 1

4. User chooses "Continue as Guest"
   → POST /api/v1/checkout/guest
   → Requires: email, shipping address, payment
   → Creates order without user account
   → Sends confirmation email

5. (Optional) After order: "Create account to track your order?"
   → POST /api/v1/auth/register
   → Links order to new user account
```

---

## Architecture Patterns

### Option A: Unified Cart (Recommended)

**Single Cart Entity** that works for both guest and authenticated users:

```typescript
// Cart Entity
interface Cart {
  id: string;
  userId?: string;        // NULL for guest carts
  sessionId?: string;     // For guest carts
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;       // Auto-cleanup old guest carts
}

// Cart is identified by:
// - userId if user is logged in
// - sessionId if user is guest
```

**Pros**:
- Single source of truth
- Easy to merge carts on login
- Consistent business logic
- Simple to track abandoned carts

**Cons**:
- Needs cleanup job for expired guest carts
- Database stores temporary data

### Option B: Separate Storage

**Guest Cart**: In-memory cache (Redis) or session storage
**User Cart**: Database (PostgreSQL)

**Pros**:
- Guest carts don't clutter database
- Faster for guest operations
- Auto-expiry with Redis TTL

**Cons**:
- Two cart implementations
- More complex merge logic
- Can't track abandoned guest carts easily

---

## Recommended Implementation (Option A)

### 1. Cart Domain Model

```typescript
// apps/server/src/modules/cart/domain/cart.entity.ts

export interface CartProps {
  userId?: string;        // Optional: null for guests
  sessionId?: string;     // Optional: null for logged-in users
  items: CartItem[];
  expiresAt: Date;
}

export class Cart extends Entity<CartProps> {

  get userId(): string | undefined {
    return this.props.userId;
  }

  get sessionId(): string | undefined {
    return this.props.sessionId;
  }

  get items(): CartItem[] {
    return this.props.items;
  }

  get isGuest(): boolean {
    return !this.props.userId && !!this.props.sessionId;
  }

  get isAuthenticated(): boolean {
    return !!this.props.userId;
  }

  // Business logic
  addItem(productId: string, quantity: number): void {
    const existing = this.items.find(i => i.productId === productId);
    if (existing) {
      existing.updateQuantity(existing.quantity + quantity);
    } else {
      this.items.push(CartItem.create({ productId, quantity }));
    }
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  validate(): void {
    // Guest cart must have sessionId
    if (!this.userId && !this.sessionId) {
      throw new Error('Cart must have either userId or sessionId');
    }

    // Can't have both
    if (this.userId && this.sessionId) {
      throw new Error('Cart cannot have both userId and sessionId');
    }
  }

  static createGuestCart(sessionId: string): Cart {
    return new Cart({
      id: randomUUID(),
      props: {
        sessionId,
        items: [],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });
  }

  static createUserCart(userId: string): Cart {
    return new Cart({
      id: randomUUID(),
      props: {
        userId,
        items: [],
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      }
    });
  }
}
```

### 2. Cart Repository

```typescript
// apps/server/src/modules/cart/db/cart-repository.ts

export interface CartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  findBySessionId(sessionId: string): Promise<Cart | null>;
  save(cart: Cart): Promise<void>;
  delete(id: string): Promise<void>;
  mergeGuestCartToUser(sessionId: string, userId: string): Promise<void>;
}
```

### 3. Session Middleware

```typescript
// apps/server/src/middlewares/session.middleware.ts

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check if session exists
    let sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      // Create new session for guest
      sessionId = randomUUID();
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
      });
    }

    // Attach to request
    req.sessionId = sessionId;
    next();
  }
}
```

### 4. Cart Commands (Supporting Both)

```typescript
// apps/server/src/modules/cart/commands/add-item/handler.ts

@CommandHandler(AddItemToCartCommand)
export class AddItemToCartHandler {
  constructor(
    @Inject('CartRepository') private repo: CartRepository,
    @Inject('ProductRepository') private productRepo: ProductRepository,
  ) {}

  async execute(command: AddItemToCartCommand) {
    const { productId, quantity, userId, sessionId } = command;

    // Verify product exists and has stock
    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < quantity) throw new BadRequestException('Insufficient stock');

    // Find or create cart
    let cart: Cart;

    if (userId) {
      // Authenticated user
      cart = await this.repo.findByUserId(userId)
        || Cart.createUserCart(userId);
    } else {
      // Guest user
      cart = await this.repo.findBySessionId(sessionId)
        || Cart.createGuestCart(sessionId);
    }

    // Add item
    cart.addItem(productId, quantity);

    // Save
    await this.repo.save(cart);

    return cart;
  }
}
```

### 5. Merge Cart on Login

```typescript
// apps/server/src/modules/auth/commands/login/handler.ts

@CommandHandler(LoginCommand)
export class LoginHandler {
  constructor(
    @Inject('UserRepository') private userRepo: UserRepository,
    @Inject('CartRepository') private cartRepo: CartRepository,
    private jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password, sessionId } = command;

    // Authenticate user
    const user = await this.userRepo.findByEmail(email);
    if (!user || !await user.comparePassword(password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Merge guest cart if exists
    if (sessionId) {
      await this.cartRepo.mergeGuestCartToUser(sessionId, user.id);
    }

    // Generate tokens
    const accessToken = this.jwtService.sign({ sub: user.id });

    return { accessToken, user };
  }
}
```

### 6. Controller (Optional Auth)

```typescript
// apps/server/src/modules/cart/commands/add-item/controller.ts

@Controller(routesV1.cart.root)
export class AddItemToCartController {
  constructor(private commandBus: CommandBus) {}

  @Post('items')
  @UseGuards(OptionalAuthGuard)  // ← Key: Optional auth
  async addItem(
    @Body(ZodPipe(AddItemSchema)) body: AddItemDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.id;      // Undefined if not logged in
    const sessionId = req.sessionId;  // Always present (from middleware)

    const result = await this.commandBus.execute(
      new AddItemToCartCommand({
        ...body,
        userId,
        sessionId,
      })
    );

    return created(result);
  }
}
```

### 7. Optional Auth Guard

```typescript
// apps/server/src/guards/optional-auth.guard.ts

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    // Don't throw error if no user (allow anonymous)
    // Just return undefined user
    return user;
  }
}
```

---

## API Endpoint Design

### Public Endpoints (No Auth Required)
```
GET    /api/v1/products              # Browse products
GET    /api/v1/products/:id          # Product details
GET    /api/v1/products/search       # Search products
GET    /api/v1/categories            # List categories
```

### Optional Auth Endpoints
```
POST   /api/v1/cart/items            # Add to cart (guest or user)
PATCH  /api/v1/cart/items/:id        # Update quantity (guest or user)
DELETE /api/v1/cart/items/:id        # Remove item (guest or user)
GET    /api/v1/cart                  # Get cart (guest or user)
```

### Auth Required Endpoints
```
POST   /api/v1/orders                # Create order
GET    /api/v1/orders                # Order history
GET    /api/v1/orders/:id            # Order details
GET    /api/v1/users/profile         # User profile
POST   /api/v1/users/addresses       # Add address
```

---

## Database Schema Updates

### Prisma Schema
```prisma
model Cart {
  id        String   @id @default(uuid())
  userId    String?  @map("user_id")  // NULL for guest
  sessionId String?  @map("session_id") @unique // NULL for user
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user      User?    @relation(fields: [userId], references: [id])
  items     CartItem[]

  @@index([userId])
  @@index([sessionId])
  @@index([expiresAt]) // For cleanup job
  @@map("carts")
}

model CartItem {
  id        String @id @default(uuid())
  cartId    String @map("cart_id")
  productId String @map("product_id")
  quantity  Int

  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId]) // One product per cart
  @@map("cart_items")
}
```

---

## Cleanup Strategy

### Scheduled Job (Clear Expired Guest Carts)
```typescript
// apps/server/src/modules/cart/jobs/cleanup-expired-carts.job.ts

@Injectable()
export class CleanupExpiredCartsJob {
  constructor(
    @Inject('CartRepository') private repo: CartRepository,
  ) {}

  @Cron('0 0 * * *') // Daily at midnight
  async handle() {
    const deleted = await this.repo.deleteExpired();
    console.log(`Cleaned up ${deleted} expired carts`);
  }
}
```

---

## Summary

### What You Need to Build

1. **Cart works for both guest and authenticated users**
   - Guest: identified by sessionId (cookie)
   - User: identified by userId (JWT)

2. **Product browsing is PUBLIC**
   - No auth required to browse/search

3. **Cart operations are OPTIONAL AUTH**
   - Works with or without login
   - Uses OptionalAuthGuard

4. **Checkout requires LOGIN or GUEST INFO**
   - User must either login or provide email/address
   - On login: merge guest cart to user cart

5. **Order history requires AUTH**
   - Only logged-in users can view past orders

This approach gives you:
- ✅ Low friction (browse without signup)
- ✅ Persistent cart for logged-in users
- ✅ Cart merging on login
- ✅ Clean architecture with your DDD patterns
- ✅ Guest checkout option

The key is: **sessionId for guests, userId for authenticated, merge on login**.
