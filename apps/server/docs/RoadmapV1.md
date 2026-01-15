# MyCommerce - V1 Roadmap

## Overview
This roadmap outlines the minimal viable features needed to launch MyCommerce v1 - a functional e-commerce platform with core buying and selling capabilities.

## Current State
- ✅ User domain with DDD entities
- ✅ Product domain entities
- 🚧 Auth flow (session management in progress)
- ✅ DDD+CQRS architecture established
- ✅ Database setup (Prisma + PostgreSQL)

---

## V1 Milestones

### Phase 1: Core Authentication & User Management
**Goal**: Complete user authentication and profile management

#### Tasks
  - Complete session management (refresh token flow)
  - [✅] Add logout command
  - [✅] User profile queries
  - [✅] Address management
  - [✅] Add address command
  - [✅] Update address command
  - [✅] Delete address command
  - [✅] List addresses query

**Acceptance Criteria**:
- Users can register, login, logout, and refresh sessions
- Users can manage their profile and multiple addresses
---

### Phase 2: Product Catalog Management
**Goal**: Enable product browsing and management

#### Tasks
- [ ] Product CRUD operations
  - [✅] Create product command (admin)
  - [✅] Update product command (admin)
  - Delete/archive product command (admin)
  - Get product by ID query
  - List products query (with pagination)
  - Search products query (by name, description)
- [ ] Product image management
  - Upload product image command
  - Delete product image command
- [ ] Product categories
  - Create simple category entity
  - Assign products to categories
  - Filter products by category
- [ ] Product inventory tracking
  - Add stock quantity to product
  - Update stock command
  - Check stock availability query

**Acceptance Criteria**:
- Admins can create and manage products with images
- Customers can browse, search, and filter products
- Stock levels are tracked and displayed

---

### Phase 3: Shopping Cart
**Goal**: Allow users to build a cart before checkout

#### Tasks
- [ ] Cart domain model
  - Cart aggregate with CartItem entities
  - Cart value objects (quantity, subtotal)
- [ ] Cart commands
  - Add item to cart command
  - Update cart item quantity command
  - Remove item from cart command
  - Clear cart command
- [ ] Cart queries
  - Get cart query (with calculated totals)
  - Validate cart query (check stock availability)
- [ ] Cart business rules
  - Validate stock before adding
  - Calculate totals (subtotal, tax, shipping)
  - Handle out-of-stock items

**Acceptance Criteria**:
- Users can add/remove/update items in their cart
- Cart persists across sessions
- Cart validates stock availability
- Totals are calculated correctly

---

### Phase 4: Order Processing
**Goal**: Convert carts into orders and track them

#### Tasks
- [ ] Order domain model
  - Order aggregate with OrderItem entities
  - Order status value object (pending, confirmed, shipped, delivered, cancelled)
  - Order total calculation
- [ ] Checkout commands
  - Create order from cart command
  - Validate order (stock, address, payment readiness)
  - Update order status command
  - Cancel order command
- [ ] Order queries
  - Get order by ID query
  - List user orders query (with pagination)
  - List all orders query (admin, with filters)
- [ ] Order business rules
  - Deduct inventory on order creation
  - Validate shipping address
  - Generate order number
  - Clear cart after successful order

**Acceptance Criteria**:
- Users can place orders from their cart
- Orders deduct from inventory
- Users can view their order history
- Admins can manage order status

---

### Phase 5: Basic Admin Features
**Goal**: Provide minimal admin capabilities

#### Tasks
- [ ] Role-based authorization
  - Add role to User entity (customer, admin)
  - Create authorization guards
  - Apply guards to admin endpoints
- [ ] Admin dashboard queries
  - Get order statistics query
  - Get low stock products query
  - Get recent orders query
- [ ] Product management UI considerations
  - Bulk update stock command
  - Bulk archive products command

**Acceptance Criteria**:
- Admin users can manage products and orders
- Regular users cannot access admin endpoints
- Basic dashboard statistics available

---

### Phase 6: Essential Integrations
**Goal**: Add minimal third-party services for v1

#### Tasks
- [ ] Email notifications (simple SMTP or service)
  - Welcome email on registration
  - Order confirmation email
  - Password reset email
- [ ] File upload service
  - Product image upload (S3 or local for v1)
  - Image optimization/resizing
- [ ] Payment gateway integration (optional for v1)
  - Stripe or PayPal basic integration
  - Payment intent creation
  - Webhook handling for payment confirmation

**Acceptance Criteria**:
- Users receive transactional emails
- Product images can be uploaded and served
- (Optional) Payment processing works end-to-end

---

## Post-V1 Features (Future Roadmap)

### Not in V1 Scope
The following features are important but not required for initial launch:

- **Reviews & Ratings**: Product reviews and ratings system
- **Wishlist**: Save products for later
- **Coupons & Discounts**: Promotional codes and discounts
- **Advanced Search**: Elasticsearch integration, faceted search
- **Recommendations**: Product recommendation engine
- **Multi-vendor**: Marketplace with multiple sellers
- **Advanced Inventory**: Warehouse management, stock transfers
- **Shipping Integration**: Real-time shipping rates, tracking
- **Analytics**: Advanced reporting and analytics
- **Customer Support**: Live chat, ticketing system
- **Social Features**: Share products, social login

---

## Development Guidelines

### Keep V1 Simple
- Focus on core user flows: browse → add to cart → checkout → order
- Avoid over-engineering: minimal features that work well
- Use existing DDD patterns consistently
- Write tests for critical paths (auth, checkout, payment)

### Architecture Principles
- Continue DDD+CQRS pattern for all modules
- Maintain separation: domain, application, infrastructure
- Use Zod schemas for all API validation
- Follow repository pattern for data access
- Keep aggregates small and focused

### Testing Strategy
- BDD tests for critical user journeys
- Unit tests for domain logic and value objects
- E2E tests for complete flows (registration → checkout)
- Integration tests for external services (payment, email)

### Deployment Readiness
- Environment configuration for prod/staging/dev
- Database migrations tested and documented
- Error monitoring setup (Sentry or similar)
- Basic logging and observability
- CI/CD pipeline for automated deployments

---

## Success Metrics for V1

**Must Have**:
- Users can register and login
- Users can browse products
- Users can add products to cart
- Users can place orders
- Admins can manage products and orders

**Nice to Have**:
- Email notifications working
- Payment integration (can use mock for v1)
- Basic order tracking

**Technical Requirements**:
- All endpoints have input validation
- Authentication and authorization working
- Database migrations run successfully
- Tests pass for core features
- API documentation (Swagger/OpenAPI)

---

## Estimated Timeline

This roadmap represents approximately **8-12 weeks** of focused development:

- Phase 1: 1-2 weeks
- Phase 2: 2-3 weeks
- Phase 3: 1-2 weeks
- Phase 4: 2-3 weeks
- Phase 5: 1 week
- Phase 6: 1-2 weeks

**Note**: Timeline assumes one developer working full-time. Adjust based on team size and availability.

---

## Next Steps

1. **Immediate**: Complete Phase 1 (Auth & User Management)
   - Finish session management implementation
   - Add logout and password reset

2. **High Priority**: Start Phase 2 (Product Catalog)
   - Build on existing product domain
   - Implement product CRUD commands/queries

3. **Parallel Work**: Set up testing infrastructure
   - Expand BDD test coverage
   - Create E2E test suite structure

Start with Phase 1 and proceed sequentially, ensuring each phase is complete before moving to the next. This ensures a solid foundation for your e-commerce platform.
