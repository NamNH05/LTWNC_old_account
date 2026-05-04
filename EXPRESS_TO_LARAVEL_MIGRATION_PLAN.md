# 🔄 LTWNC Shop - Express to Laravel Migration Plan

Kế hoạch chi tiết để chuyển đổi từ Express.js/React sang PHP Laravel/React mà **không bị sai lệch**.

**Prepared for**: Agent Backend Developer  
**Estimated effort**: 8 weeks full-time  
**Last updated**: 2026-05-04

---

## 📋 Tổng quan

### Scope
- ✅ Backend: Express.js → Laravel 11
- ✅ Frontend: React → Giữ nguyên (không thay đổi)
- ✅ Database: PostgreSQL → Giữ nguyên
- ✅ API: RESTful endpoints → Giữ nguyên format
- ❌ NOT migrating: Frontend architecture, UI components

### Timeline
```
Week 1:   Preparation & Setup
Week 2:   Database & Models
Week 3:   Authentication & Middleware
Week 4-5: Controllers & Routes (Core modules)
Week 6:   Services & Business Logic
Week 7:   Testing & Quality Assurance
Week 8:   Deployment & Final Testing
```

### Success Criteria
- ✅ 100% API endpoints working identically
- ✅ All tests passing
- ✅ Zero data loss
- ✅ Performance ≥ Express (≥95% of original)
- ✅ Documented & deployable

---

## 🗺️ WEEK 1: Preparation & Environment Setup

### 1.1 Team & Knowledge

#### Action items:
- [ ] Team learns Laravel basics (3 days)
  - Docs: https://laravel.com/docs/11/getting-started
  - Key concepts: Artisan, Routes, Controllers, Middleware, Services
  
- [ ] Team learns Eloquent ORM (2 days)
  - Docs: https://laravel.com/docs/11/eloquent
  - Key: Relationships, Scopes, Casting

- [ ] Review Express codebase thoroughly (1 day)
  - Read all controllers, services, routes
  - Document all logic patterns

#### Resources:
```
Learning time: ~40 hours
- Laravel fundamentals: 16 hours
- Eloquent ORM: 8 hours
- Review Express code: 8 hours
- Practice building small module: 8 hours
```

### 1.2 Environment Setup

#### Step 1: System requirements
```bash
# Check requirements
php -v              # PHP 8.2+ required
composer --version  # Composer 2.0+
postgresql --version # PostgreSQL 14+
```

#### Step 2: Create Laravel project
```bash
# Create new Laravel project
composer create-project laravel/laravel ltwnc-shop-laravel

cd ltwnc-shop-laravel

# Install required packages
composer require tymon/jwt-auth:^2.0
composer require laravel/cors
composer require barryvdh/laravel-ide-helper --dev
composer require phpstan/phpstan --dev
```

#### Step 3: Environment configuration
```bash
# Copy .env.example
cp .env.example .env

# Generate app key
php artisan key:generate

# Database configuration
# .env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=shopdb
DB_USERNAME=shopuser
DB_PASSWORD=shoppass

# JWT configuration
JWT_SECRET=<generate_random_string>
JWT_ALGORITHM=HS256
JWT_TTL=900        # 15 minutes (like Express ACCESS_TOKEN_TTL)
JWT_REFRESH_TTL=10080  # 7 days
```

#### Step 4: Project structure
```bash
# Create custom directories for organization
mkdir -p app/Services
mkdir -p app/Repositories
mkdir -p app/Enums
mkdir -p app/DTOs
mkdir -p app/Exceptions
mkdir -p database/seeders
mkdir -p routes/v1
mkdir -p tests/Feature/API
mkdir -p tests/Unit/Services
```

#### Checkpoint: Week 1 Validation
- [ ] PHP 8.2+ installed
- [ ] Composer packages installed
- [ ] Database connection working (`php artisan db` connects)
- [ ] Laravel artisan commands working
- [ ] `.env` configured correctly

**Estimated time**: 40 hours

---

## 🗄️ WEEK 2: Database & Models

### 2.1 Database Schema Mapping

#### Express → Laravel mapping

| Express (Prisma) | Laravel (Eloquent) |
|-----------------|------------------|
| `schema.prisma` | `database/migrations/` |
| `@id @default(autoincrement())` | `$table->id()` |
| `String @unique` | `$table->string('email')->unique()` |
| `Float` | `$table->double()` |
| `DateTime @default(now())` | `$table->timestamps()` |
| `DateTime? @map("deleted_at")` | `$table->softDeletes()` |
| `@relation` | `->foreign()` or Eloquent relation |
| Enum | `$table->enum('role', ['ADMIN', 'USER'])` |

### 2.2 Create Migrations

#### Step 1: Create User migration
```bash
php artisan make:migration create_users_table
```

**File**: `database/migrations/xxxx_create_users_table.php`
```php
public function up(): void
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('email')->unique();
        $table->string('password');
        $table->string('full_name');
        $table->string('phone')->nullable();
        $table->enum('role', ['ADMIN', 'USER'])->default('USER');
        $table->boolean('is_active')->default(true);
        $table->softDeletes();
        $table->timestamps();
        
        $table->index('deleted_at');
    });
}

public function down(): void
{
    Schema::dropIfExists('users');
}
```

#### Step 2: Create all other migrations
```bash
# Run these commands
php artisan make:migration create_categories_table
php artisan make:migration create_products_table
php artisan make:migration create_carts_table
php artisan make:migration create_cart_items_table
php artisan make:migration create_addresses_table
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
php artisan make:migration create_payments_table
php artisan make:migration create_audit_logs_table
php artisan make:migration create_module_settings_table
```

#### Complete Migration Template
```php
// For Category
public function up(): void
{
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->string('name')->unique();
        $table->string('slug')->unique();
        $table->text('desc')->nullable();
        $table->softDeletes();
        $table->timestamps();
        $table->index('deleted_at');
    });
}

// For Product
public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
        $table->string('name');
        $table->string('slug')->unique();
        $table->text('desc')->nullable();
        $table->double('price');
        $table->double('origin_price')->nullable();
        $table->integer('stock')->default(0);
        $table->string('image')->nullable();
        $table->boolean('is_active')->default(true);
        $table->softDeletes();
        $table->timestamps();
        
        $table->index('category_id');
        $table->index(['is_active', 'category_id']);
        $table->index('name');
        $table->index('deleted_at');
    });
}

// For Order
public function up(): void
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
        $table->enum('status', ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])->default('PENDING');
        $table->double('total_price');
        $table->string('shipping_addr');
        $table->string('phone_number');
        $table->text('note')->nullable();
        $table->softDeletes();
        $table->timestamps();
        
        $table->index('user_id');
        $table->index(['user_id', 'created_at']);
        $table->index(['status', 'created_at']);
        $table->index('deleted_at');
    });
}

// For Payment (VNPAY)
public function up(): void
{
    Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->unique()->constrained('orders')->onDelete('cascade');
        $table->double('amount');
        $table->string('payment_method')->nullable();
        $table->string('payment_status')->default('PENDING');
        $table->string('transaction_id')->nullable();
        $table->string('bank_code')->nullable();
        $table->string('response_code')->nullable();
        $table->timestamp('paid_at')->nullable();
        $table->longText('gateway_payload')->nullable();
        $table->text('notes')->nullable();
        $table->timestamps();
        
        $table->index('payment_status');
        $table->index('transaction_id');
        $table->index('created_at');
    });
}
```

### 2.3 Create Models (Eloquent)

```bash
# Generate all models
php artisan make:model User
php artisan make:model Category
php artisan make:model Product
php artisan make:model Cart
php artisan make:model CartItem
php artisan make:model Address
php artisan make:model Order
php artisan make:model OrderItem
php artisan make:model Payment
php artisan make:model AuditLog
php artisan make:model ModuleSetting
```

#### Step 1: User Model
**File**: `app/Models/User.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'email',
        'password',
        'full_name',
        'phone',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }
}
```

#### Step 2: Product & Category Models
```php
// Category Model
class Category extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'slug', 'desc'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}

// Product Model
class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'desc',
        'price',
        'origin_price',
        'stock',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'float',
        'origin_price' => 'float',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
```

#### Step 3: Order-related Models
```php
// Order Model
class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'status',
        'total_price',
        'shipping_addr',
        'phone_number',
        'note',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'total_price' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}

// Payment Model (VNPAY)
class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'amount',
        'payment_method',
        'payment_status',
        'transaction_id',
        'bank_code',
        'response_code',
        'paid_at',
        'gateway_payload',
        'notes',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
```

### 2.4 Run Migrations & Test

```bash
# Run all migrations
php artisan migrate

# Verify tables created
php artisan migrate:status

# If error, rollback
php artisan migrate:rollback
php artisan migrate:refresh  # FOR DEV ONLY
```

#### Checkpoint: Week 2 Validation
- [ ] All 11 migrations created
- [ ] All migrations run successfully
- [ ] All models created with relationships
- [ ] Database schema matches Express Prisma schema
- [ ] Run `php artisan tinker` and verify models load

**Estimated time**: 30 hours

---

## 🔐 WEEK 3: Authentication & Middleware

### 3.1 Create Enums

**File**: `app/Enums/UserRole.php`
```php
<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'ADMIN';
    case USER = 'USER';
}
```

**File**: `app/Enums/OrderStatus.php`
```php
<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'PENDING';
    case CONFIRMED = 'CONFIRMED';
    case SHIPPED = 'SHIPPED';
    case DELIVERED = 'DELIVERED';
    case CANCELLED = 'CANCELLED';
}
```

### 3.2 Authentication System (JWT)

#### Step 1: Configure JWT
```bash
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret  # Generates JWT_SECRET in .env
```

**File**: `config/auth.php`
```php
'guards' => [
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

#### Step 2: User Authentication
**File**: `app/Models/User.php` (update)
```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    // ... existing code ...

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
        ];
    }
}
```

#### Step 3: Create Auth Controller
```bash
php artisan make:controller Api/AuthController
```

**File**: `app/Http/Controllers/Api/AuthController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'fullName' => 'required|string',
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'full_name' => $validated['fullName'],
        ]);

        return response()->json([
            'user' => $user->makeHidden(['password']),
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'accessToken' => $token,
            'refreshToken' => $token,  // Can implement refresh token if needed
            'user' => auth('api')->user(),
        ]);
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me()
    {
        return response()->json(auth('api')->user());
    }

    public function refresh()
    {
        return response()->json([
            'accessToken' => auth('api')->refresh(),
        ]);
    }
}
```

### 3.3 Middleware

#### Step 1: Authentication Middleware
```bash
php artisan make:middleware AuthMiddleware
```

**File**: `app/Http/Middleware/AuthMiddleware.php`
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = auth('api')->userOrFail();
            $request->user = $user;
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
```

#### Step 2: RBAC Middleware
```bash
php artisan make:middleware RbacMiddleware
```

**File**: `app/Http/Middleware/RbacMiddleware.php`
```php
<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;

class RbacMiddleware
{
    public function handle(Request $request, Closure $next, string $role)
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== $role) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
```

#### Step 3: Register Middleware
**File**: `app/Http/Kernel.php` (or appropriate middleware registration)
```php
protected $routeMiddleware = [
    'auth' => \App\Http\Middleware\AuthMiddleware::class,
    'role' => \App\Http\Middleware\RbacMiddleware::class,
];
```

#### Checkpoint: Week 3 Validation
- [ ] JWT authentication working
- [ ] User can register
- [ ] User can login and receive token
- [ ] Protected routes require auth
- [ ] RBAC middleware validates roles
- [ ] Test with API client (Postman/Insomnia)

**Estimated time**: 25 hours

---

## 🎯 WEEK 4-5: Controllers & Routes (Core Modules)

### 4.1 API Routes Structure

**File**: `routes/api.php`
```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AdminController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/refresh', [AuthController::class, 'refresh']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Products (public read)
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    
    // Cart (authenticated only)
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::put('/cart/{cartItemId}', [CartController::class, 'updateCartItem']);
    Route::delete('/cart/{cartItemId}', [CartController::class, 'removeFromCart']);
    
    // Orders
    Route::post('/orders/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders/my', [OrderController::class, 'listMyOrders']);
    Route::get('/orders/{id}', [OrderController::class, 'getOrderDetail']);
    
    // Payments
    Route::get('/payments', [PaymentController::class, 'getMyPayments']);
    Route::post('/payments/vnpay/create-url', [PaymentController::class, 'createVnpayUrl']);
    
    // User
    Route::get('/users/profile', [UserController::class, 'getProfile']);
    Route::put('/users/profile', [UserController::class, 'updateProfile']);
    
    // Address
    Route::apiResource('/addresses', AddressController::class);
    
    // Admin routes
    Route::middleware('role:ADMIN')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
        Route::post('/admin/users', [AdminController::class, 'createUser']);
        Route::get('/admin/orders', [AdminController::class, 'getAllOrders']);
        Route::put('/admin/orders/{id}', [AdminController::class, 'updateOrderStatus']);
    });
});

// Public routes
Route::get('/products/categories', [ProductController::class, 'listCategories']);
Route::get('/payments/methods', [PaymentController::class, 'getPaymentMethods']);
Route::get('/payments/vnpay/return', [PaymentController::class, 'handleVnpayReturn']);
Route::get('/payments/vnpay/ipn', [PaymentController::class, 'handleVnpayIpn']);
```

### 4.2 Create Controllers

#### Step 1: Product Controller
```bash
php artisan make:controller Api/ProductController
```

**File**: `app/Http/Controllers/Api/ProductController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('is_active', true)->where('deleted_at', null);

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        $products = $query->paginate(20);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return response()->json($product);
    }

    public function listCategories()
    {
        $categories = Category::where('deleted_at', null)->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        // Admin only - validate
        $validated = $request->validate([
            'name' => 'required|string|unique:products',
            'slug' => 'required|string|unique:products',
            'categoryId' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'category_id' => $validated['categoryId'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        // Admin only
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|unique:products,name,' . $id,
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
    {
        // Soft delete
        Product::findOrFail($id)->delete();

        return response()->json(['message' => 'Product deleted'], 204);
    }
}
```

#### Step 2: Cart Controller
```bash
php artisan make:controller Api/CartController
```

**File**: `app/Http/Controllers/Api/CartController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function getCart(Request $request)
    {
        $user = auth('api')->user();
        $cart = Cart::with('items.product')->firstOrCreate([
            'user_id' => $user->id,
        ]);

        return response()->json($cart);
    }

    public function addToCart(Request $request)
    {
        $user = auth('api')->user();
        $validated = $request->validate([
            'productId' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $cartItem = CartItem::updateOrCreate(
            [
                'cart_id' => $cart->id,
                'product_id' => $validated['productId'],
            ],
            [
                'quantity' => $validated['quantity'],
            ]
        );

        return response()->json($cartItem->load('product'), 201);
    }

    public function updateCartItem(Request $request, $cartItemId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::findOrFail($cartItemId);
        $cartItem->update($validated);

        return response()->json($cartItem);
    }

    public function removeFromCart($cartItemId)
    {
        CartItem::findOrFail($cartItemId)->delete();

        return response()->json(['message' => 'Removed from cart'], 204);
    }
}
```

#### Step 3: Order Controller
```bash
php artisan make:controller Api/OrderController
```

**File**: `app/Http/Controllers/Api/OrderController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Enums\OrderStatus;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $user = auth('api')->user();
        $validated = $request->validate([
            'shippingAddr' => 'required|string',
            'phoneNumber' => 'required|string',
            'note' => 'nullable|string',
        ]);

        // Get user's cart
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        // Calculate total
        $totalPrice = $cart->items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        // Create order
        $order = Order::create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
            'total_price' => $totalPrice,
            'shipping_addr' => $validated['shippingAddr'],
            'phone_number' => $validated['phoneNumber'],
            'note' => $validated['note'] ?? null,
        ]);

        // Create order items
        foreach ($cart->items as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->product->price,
            ]);
        }

        // Clear cart
        $cart->items()->delete();

        return response()->json($order->load('items'), 201);
    }

    public function listMyOrders(Request $request)
    {
        $user = auth('api')->user();
        $orders = Order::where('user_id', $user->id)
            ->with('items.product')
            ->paginate(10);

        return response()->json($orders);
    }

    public function getOrderDetail($id)
    {
        $order = Order::with('items.product', 'payment')->findOrFail($id);

        return response()->json($order);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        // Admin only
        $validated = $request->validate([
            'status' => 'required|in:PENDING,CONFIRMED,SHIPPED,DELIVERED,CANCELLED',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json($order);
    }
}
```

#### Step 4: Payment Controller (VNPAY)
```bash
php artisan make:controller Api/PaymentController
```

**File**: `app/Http/Controllers/Api/PaymentController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    private $vnpayConfig = [
        'TMN_CODE' => '',  // From env
        'HASH_SECRET' => '',  // From env
        'URL' => 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    ];

    public function __construct()
    {
        $this->vnpayConfig['TMN_CODE'] = config('services.vnpay.tmnCode');
        $this->vnpayConfig['HASH_SECRET'] = config('services.vnpay.hashSecret');
    }

    public function getPaymentMethods()
    {
        return response()->json([
            ['code' => 'VNPAY', 'name' => 'VNPAY'],
        ]);
    }

    public function createVnpayUrl(Request $request)
    {
        $validated = $request->validate([
            'orderId' => 'required|exists:orders,id',
        ]);

        $order = Order::findOrFail($validated['orderId']);

        // Create payment record
        $payment = Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'amount' => $order->total_price,
                'payment_method' => 'VNPAY',
                'payment_status' => 'PENDING',
            ]
        );

        // Build VNPAY URL
        $vnpayUrl = $this->buildVnpayUrl($order, $payment);

        return response()->json(['paymentUrl' => $vnpayUrl]);
    }

    public function handleVnpayReturn(Request $request)
    {
        $vnpData = $request->all();

        // Verify VNPAY response
        $isValid = $this->verifyVnpayResponse($vnpData);

        if (!$isValid) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $orderId = $vnpData['vnp_OrderInfo'];
        $transactionNo = $vnpData['vnp_TransactionNo'];
        $responseCode = $vnpData['vnp_ResponseCode'];

        $payment = Payment::where('order_id', $orderId)->first();

        if ($responseCode === '00') {
            // Payment successful
            $payment->update([
                'payment_status' => 'SUCCESS',
                'transaction_id' => $transactionNo,
                'response_code' => $responseCode,
                'paid_at' => now(),
            ]);

            // Update order status
            Order::find($orderId)->update(['status' => 'CONFIRMED']);

            return response()->json(['message' => 'Payment successful']);
        } else {
            // Payment failed
            $payment->update([
                'payment_status' => 'FAILED',
                'transaction_id' => $transactionNo,
                'response_code' => $responseCode,
            ]);

            return response()->json(['error' => 'Payment failed'], 400);
        }
    }

    public function handleVnpayIpn(Request $request)
    {
        $vnpData = $request->all();

        // Verify IPN
        $isValid = $this->verifyVnpayResponse($vnpData);

        if (!$isValid) {
            return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
        }

        $orderId = $vnpData['vnp_OrderInfo'];
        $responseCode = $vnpData['vnp_ResponseCode'];
        $transactionNo = $vnpData['vnp_TransactionNo'];

        $payment = Payment::where('order_id', $orderId)->first();

        if ($responseCode === '00') {
            if ($payment->payment_status !== 'SUCCESS') {
                $payment->update([
                    'payment_status' => 'SUCCESS',
                    'transaction_id' => $transactionNo,
                    'paid_at' => now(),
                ]);

                Order::find($orderId)->update(['status' => 'CONFIRMED']);
            }

            return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
        } else {
            return response()->json(['RspCode' => '01', 'Message' => 'Confirm Error']);
        }
    }

    private function buildVnpayUrl($order, $payment)
    {
        $startTime = date("YmdHis");
        $expire = date('YmdHis', strtotime('+15 minutes'));

        $data = [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => $this->vnpayConfig['TMN_CODE'],
            'vnp_Amount' => intval($order->total_price * 100),
            'vnp_CurrCode' => 'VND',
            'vnp_TxnRef' => $order->id . time(),
            'vnp_OrderInfo' => $order->id,
            'vnp_OrderType' => 'billpayment',
            'vnp_Locale' => 'vn',
            'vnp_ReturnUrl' => config('app.frontend_url') . '/payment/success',
            'vnp_IpnUrl' => config('app.url') . '/api/payments/vnpay/ipn',
            'vnp_CreateDate' => $startTime,
            'vnp_ExpireDate' => $expire,
            'vnp_Bill_Mobile' => $order->phone_number,
        ];

        ksort($data);

        $query = http_build_query($data);
        $hashData = hash_hmac('sha512', $query, $this->vnpayConfig['HASH_SECRET']);

        return $this->vnpayConfig['URL'] . '?' . $query . '&vnp_SecureHash=' . $hashData;
    }

    private function verifyVnpayResponse($data)
    {
        if (empty($data['vnp_SecureHash'])) {
            return false;
        }

        $secureHash = $data['vnp_SecureHash'];
        unset($data['vnp_SecureHash']);
        unset($data['vnp_SecureHashType']);

        ksort($data);
        $query = http_build_query($data);
        $hashData = hash_hmac('sha512', $query, $this->vnpayConfig['HASH_SECRET']);

        return $secureHash === $hashData;
    }

    public function getMyPayments(Request $request)
    {
        $user = auth('api')->user();
        $payments = Payment::whereIn('order_id', function ($query) use ($user) {
            $query->select('id')->from('orders')->where('user_id', $user->id);
        })->paginate(10);

        return response()->json($payments);
    }
}
```

#### Step 5: User & Address Controllers
```bash
php artisan make:controller Api/UserController
php artisan make:controller Api/AddressController
```

**File**: `app/Http/Controllers/Api/UserController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getProfile(Request $request)
    {
        return response()->json(auth('api')->user());
    }

    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();
        $validated = $request->validate([
            'fullName' => 'string',
            'phone' => 'string',
        ]);

        $user->update([
            'full_name' => $validated['fullName'] ?? $user->full_name,
            'phone' => $validated['phone'] ?? $user->phone,
        ]);

        return response()->json($user);
    }
}
```

**File**: `app/Http/Controllers/Api/AddressController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $user = auth('api')->user();
        $addresses = Address::where('user_id', $user->id)
            ->where('deleted_at', null)
            ->get();

        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $user = auth('api')->user();
        $validated = $request->validate([
            'street' => 'required|string',
            'ward' => 'required|string',
            'district' => 'required|string',
            'city' => 'required|string',
            'zipCode' => 'nullable|string',
            'isDefault' => 'boolean',
        ]);

        $address = Address::create([
            'user_id' => $user->id,
            'street' => $validated['street'],
            'ward' => $validated['ward'],
            'district' => $validated['district'],
            'city' => $validated['city'],
            'zip_code' => $validated['zipCode'],
            'is_default' => $validated['isDefault'] ?? false,
        ]);

        return response()->json($address, 201);
    }

    public function update(Request $request, $id)
    {
        $address = Address::findOrFail($id);
        $address->update($request->all());

        return response()->json($address);
    }

    public function destroy($id)
    {
        Address::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
```

#### Checkpoint: Week 4-5 Validation
- [ ] All controllers created
- [ ] All routes defined
- [ ] Test all endpoints with Postman/Insomnia
- [ ] Auth endpoints working
- [ ] Product CRUD working
- [ ] Cart operations working
- [ ] Order checkout working
- [ ] VNPAY integration stubbed

**Estimated time**: 50 hours

---

## 🔧 WEEK 6: Services & Business Logic

### 6.1 Create Service Layer

#### Step 1: Order Service
```bash
mkdir -p app/Services
```

**File**: `app/Services/OrderService.php`
```php
<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Cart;
use App\Enums\OrderStatus;

class OrderService
{
    public function createOrder($userId, $shippingAddr, $phoneNumber, $note = null)
    {
        $cart = Cart::with('items.product')->where('user_id', $userId)->first();

        if (!$cart || $cart->items->isEmpty()) {
            throw new \Exception('Cart is empty');
        }

        // Calculate total
        $totalPrice = $cart->items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        // Create order
        $order = Order::create([
            'user_id' => $userId,
            'status' => OrderStatus::PENDING,
            'total_price' => $totalPrice,
            'shipping_addr' => $shippingAddr,
            'phone_number' => $phoneNumber,
            'note' => $note,
        ]);

        // Create order items
        foreach ($cart->items as $cartItem) {
            $order->items()->create([
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->product->price,
            ]);
        }

        // Clear cart
        $cart->items()->delete();

        return $order;
    }

    public function cancelOrder($orderId)
    {
        $order = Order::findOrFail($orderId);

        if ($order->status === OrderStatus::DELIVERED || $order->status === OrderStatus::CANCELLED) {
            throw new \Exception('Cannot cancel this order');
        }

        $order->update(['status' => OrderStatus::CANCELLED]);

        return $order;
    }
}
```

#### Step 2: Payment Service
**File**: `app/Services/PaymentService.php`
```php
<?php

namespace App\Services;

use App\Models\Payment;

class PaymentService
{
    public function handleVnpayCallback($vnpData)
    {
        // Verify signature
        if (!$this->verifyVnpaySignature($vnpData)) {
            throw new \Exception('Invalid signature');
        }

        $orderId = $vnpData['vnp_OrderInfo'];
        $responseCode = $vnpData['vnp_ResponseCode'];

        $payment = Payment::where('order_id', $orderId)->firstOrFail();

        if ($responseCode === '00') {
            $payment->update([
                'payment_status' => 'SUCCESS',
                'transaction_id' => $vnpData['vnp_TransactionNo'],
                'paid_at' => now(),
            ]);
        } else {
            $payment->update([
                'payment_status' => 'FAILED',
                'transaction_id' => $vnpData['vnp_TransactionNo'],
            ]);
        }

        return $payment;
    }

    private function verifyVnpaySignature($data)
    {
        // Implementation
        return true;
    }
}
```

### 6.2 Create Repositories

**File**: `app/Repositories/ProductRepository.php`
```php
<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    public function getActiveProducts($categoryId = null, $limit = 20, $page = 1)
    {
        $query = Product::where('is_active', true)
            ->where('deleted_at', null);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        return $query->paginate($limit, ['*'], 'page', $page);
    }

    public function findById($id)
    {
        return Product::findOrFail($id);
    }

    public function create($data)
    {
        return Product::create($data);
    }

    public function update($id, $data)
    {
        $product = Product::findOrFail($id);
        $product->update($data);
        return $product;
    }

    public function delete($id)
    {
        return Product::findOrFail($id)->delete();
    }
}
```

#### Checkpoint: Week 6 Validation
- [ ] All services created
- [ ] All repositories created
- [ ] Controllers refactored to use services
- [ ] Business logic properly separated
- [ ] Order creation flow working end-to-end

**Estimated time**: 20 hours

---

## 🧪 WEEK 7: Testing & Quality Assurance

### 7.1 Unit Tests

```bash
php artisan make:test Unit/Services/OrderServiceTest
```

**File**: `tests/Unit/Services/OrderServiceTest.php`
```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\OrderService;
use App\Models\User;
use App\Models\Cart;
use App\Models\Product;

class OrderServiceTest extends TestCase
{
    public function test_create_order_successfully()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 100]);
        $cart = Cart::create(['user_id' => $user->id]);
        $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $service = new OrderService();
        $order = $service->createOrder(
            $user->id,
            '123 Street',
            '0123456789'
        );

        $this->assertEquals(200, $order->total_price);
        $this->assertEquals(0, $cart->items()->count());
    }

    public function test_cannot_create_order_with_empty_cart()
    {
        $user = User::factory()->create();
        Cart::create(['user_id' => $user->id]);

        $service = new OrderService();

        $this->expectException(\Exception::class);
        $service->createOrder($user->id, '123 Street', '0123456789');
    }
}
```

### 7.2 Feature Tests

```bash
php artisan make:test Feature/Api/AuthTest
```

**File**: `tests/Feature/Api/AuthTest.php`
```php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'email' => 'test@example.com',
            'password' => 'password123',
            'fullName' => 'Test User',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['user' => ['id', 'email', 'full_name']]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create(['password' => bcrypt('password123')]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['accessToken', 'user']);
    }

    public function test_invalid_credentials_return_401()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrong',
        ]);

        $response->assertStatus(401);
    }
}
```

### 7.3 Database Seeding

**File**: `database/seeders/DatabaseSeeder.php`
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test users
        $adminUser = User::create([
            'email' => 'admin@test.com',
            'password' => bcrypt('123456'),
            'full_name' => 'Admin User',
            'role' => 'ADMIN',
        ]);

        $normalUser = User::create([
            'email' => 'user@test.com',
            'password' => bcrypt('123456'),
            'full_name' => 'Normal User',
            'role' => 'USER',
        ]);

        // Create categories
        $electronics = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'desc' => 'Electronic products',
        ]);

        // Create products
        Product::factory(10)->create(['category_id' => $electronics->id]);
    }
}
```

### 7.4 Run Tests

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test tests/Feature/Api/AuthTest.php

# With coverage
php artisan test --coverage
```

#### Checkpoint: Week 7 Validation
- [ ] All unit tests written
- [ ] All feature tests written
- [ ] All tests passing (100%)
- [ ] Database seeding working
- [ ] Coverage > 80%

**Estimated time**: 30 hours

---

## 🚀 WEEK 8: Deployment & Final Testing

### 8.1 Production Configuration

#### Step 1: Environment Production
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.hnamofficial.id.vn

DB_CONNECTION=pgsql
DB_HOST=prod-db-host
DB_PORT=5432
DB_DATABASE=shopdb
DB_USERNAME=shopuser
DB_PASSWORD=<secure-password>

JWT_SECRET=<strong-random-string>

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_DRIVER=redis

LOG_CHANNEL=stack
LOG_LEVEL=error
```

#### Step 2: Optimize Laravel
```bash
# Cache config, routes, views
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Run migrations
php artisan migrate --force
```

#### Step 3: Docker Deployment
**File**: `Dockerfile`
```dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    curl \
    && docker-php-ext-install pdo_pgsql

WORKDIR /app

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000

CMD ["php-fpm"]
```

**File**: `docker-compose.yml`
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres
    volumes:
      - .:/app

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - .:/app
    depends_on:
      - app

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: shopdb
      POSTGRES_USER: shopuser
      POSTGRES_PASSWORD: shoppass
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 8.2 Smoke Testing

#### API Endpoint Testing
```bash
# Test health
curl -X GET http://localhost:8000/

# Test register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","fullName":"Test"}'

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Test products
curl -X GET http://localhost:8000/api/products
```

### 8.3 Performance Testing

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://localhost:8000/api/products

# Should handle 1000 requests, 10 concurrent
# Response time < 200ms
# Error rate < 1%
```

### 8.4 Database Backup

```bash
# Create backup
pg_dump -h localhost -U shopuser shopdb > backup.sql

# Restore from backup
psql -h localhost -U shopuser shopdb < backup.sql
```

#### Final Checkpoint: Week 8 Validation
- [ ] Production environment configured
- [ ] Docker images built and tested
- [ ] All smoke tests passing
- [ ] Performance tests acceptable
- [ ] Database backups automated
- [ ] Logging configured
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Frontend can connect to new API

**Estimated time**: 25 hours

---

## 📊 Comparison: Express vs Laravel Implementation

| Feature | Express | Laravel | Notes |
|---------|---------|---------|-------|
| **Setup time** | 2 hours | 3 hours | Laravel more steps |
| **File structure** | Flexible | Opinionated | Laravel clearer |
| **ORM** | Prisma | Eloquent | Both good |
| **Testing** | Jest/Supertest | PHPUnit | Laravel built-in |
| **Admin panel** | Need to build | Filament available | Laravel advantage |
| **Performance** | ~10k req/s | ~3k req/s | Express faster |
| **Team productivity** | Need experience | Laravel ecosystem | Depends on team |

---

## 🎯 Success Metrics

### Day 1-7 (Week 1)
- ✅ Laravel environment ready
- ✅ Database migrations working

### Day 8-14 (Week 2)
- ✅ Database models created
- ✅ Schema matches Express

### Day 15-21 (Week 3)
- ✅ JWT auth working
- ✅ Protected routes functional

### Day 22-35 (Week 4-5)
- ✅ All 40+ endpoints implemented
- ✅ API compatible with React frontend

### Day 36-42 (Week 6)
- ✅ Business logic extracted to services
- ✅ Code quality high

### Day 43-49 (Week 7)
- ✅ 80%+ test coverage
- ✅ All tests passing

### Day 50-56 (Week 8)
- ✅ Production ready
- ✅ Zero downtime deployment possible

---

## ⚠️ Risk Mitigation

### Data Loss Prevention
- [ ] Daily backups of PostgreSQL
- [ ] Transaction-based migrations
- [ ] Rollback plan for each migration

### Performance Degradation
- [ ] Load testing before go-live
- [ ] Caching strategy (Redis)
- [ ] Database query optimization

### API Compatibility
- [ ] Version frontend API endpoint
- [ ] Run parallel (Express + Laravel) for 1 week
- [ ] Use feature flags for switching

### Testing Coverage
- [ ] Unit tests for all services (>80%)
- [ ] Integration tests for all workflows
- [ ] API contract testing with Postman

---

## 📝 Sign-off Checklist

Before marking as complete:

- [ ] All 8 weeks of tasks completed
- [ ] All checkpoints validated
- [ ] Test coverage > 80%
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Team trained on Laravel
- [ ] Deployment successful
- [ ] React frontend tested with new backend
- [ ] Rollback plan documented
- [ ] Monitoring & logging active

---

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Migration fails | Check for type mismatches, use raw SQL if needed |
| JWT token not working | Verify JWT_SECRET, check middleware order |
| CORS errors | Configure CORS middleware, check frontend URL |
| Performance slow | Add indexes, use query optimization, cache |
| Tests failing | Check test database config, use RefreshDatabase |

---

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs/11)
- [Eloquent ORM](https://laravel.com/docs/11/eloquent)
- [JWT Auth Package](https://jwt-auth.readthedocs.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [PHP Best Practices](https://www.php-fig.org/)

---

**This plan is comprehensive and detailed. Follow it step-by-step and you'll successfully migrate from Express to Laravel without losing functionality or data.**

*Created: 2026-05-04*
