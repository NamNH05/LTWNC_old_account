import 'dotenv/config';

// Verify DATABASE_URL is loaded
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set. Check your .env file.');
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// For Prisma v7, we need to create a custom client
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // Clear existing data (for dev only)
  await prisma.auditLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Dữ liệu cũ đã được xóa');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  // 1. Create Users
  console.log('👤 Tạo tài khoản người dùng...');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ltwnc.tech',
      password: adminPassword,
      fullName: 'Admin User',
      phone: '0123456789',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@ltwnc.tech',
      password: userPassword,
      fullName: 'Test User',
      phone: '0987654321',
      role: 'USER',
      isActive: true,
    },
  });

  console.log(`✓ Tạo 2 tài khoản: ${admin.email}, ${user.email}`);

  // 2. Create Addresses
  console.log('📍 Tạo địa chỉ...');

  await prisma.address.create({
    data: {
      userId: user.id,
      street: '123 Đường ABC',
      ward: 'Phường 1',
      district: 'Quận 1',
      city: 'TP Hồ Chí Minh',
      zipCode: '70000',
      isDefault: true,
    },
  });

  console.log('✓ Tạo địa chỉ cho user');

  // 3. Create Categories
  console.log('📦 Tạo danh mục sản phẩm...');

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Nam',
        slug: 'nam',
        desc: 'Quần áo dành cho nam',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Nữ',
        slug: 'nu',
        desc: 'Quần áo dành cho nữ',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Giày',
        slug: 'giay',
        desc: 'Giày thời trang',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Phụ kiện',
        slug: 'phu-kien',
        desc: 'Phụ kiện thời trang',
      },
    }),
  ]);

  console.log(`✓ Tạo ${categories.length} danh mục`);

  // 4. Create Products
  console.log('🛍️ Tạo sản phẩm mẫu...');

  const products = await Promise.all([
    // Nam category products
    prisma.product.create({
      data: {
        categoryId: categories[0].id,
        name: 'Áo thun nam cơ bản',
        slug: 'ao-thun-nam-co-ban-1',
        desc: 'Áo thun 100% cotton, thoải mái và bền',
        price: 199000,
        originPrice: 299000,
        stock: 50,
        image: 'https://via.placeholder.com/300x400?text=Ao+Thun+Nam',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[0].id,
        name: 'Áo sơ mi nam trắng',
        slug: 'ao-so-mi-nam-trang-1',
        desc: 'Áo sơ mi linen idéal cho mùa hè',
        price: 349000,
        originPrice: 499000,
        stock: 30,
        image: 'https://via.placeholder.com/300x400?text=Ao+So+Mi+Nam',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[0].id,
        name: 'Quần jeans nam vệt',
        slug: 'quan-jeans-nam-vet-1',
        desc: 'Quần jeans bạo lực với thiết kế vệt hiện đại',
        price: 549000,
        originPrice: 799000,
        stock: 25,
        image: 'https://via.placeholder.com/300x400?text=Quan+Jeans+Nam',
        isActive: true,
      },
    }),

    // Nữ category products
    prisma.product.create({
      data: {
        categoryId: categories[1].id,
        name: 'Áo thun nữ cơ bản',
        slug: 'ao-thun-nu-co-ban-1',
        desc: 'Áo thun phụ nữ ôm dáng, mềm mại',
        price: 189000,
        originPrice: 289000,
        stock: 45,
        image: 'https://via.placeholder.com/300x400?text=Ao+Thun+Nu',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[1].id,
        name: 'Váy nữ xếp li',
        slug: 'vay-nu-xep-li-1',
        desc: 'Váy xếp li thanh lịch, phù hợp dạo phố',
        price: 399000,
        originPrice: 599000,
        stock: 20,
        image: 'https://via.placeholder.com/300x400?text=Vay+Nu+Xep+Li',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[1].id,
        name: 'Quần legging nữ',
        slug: 'quan-legging-nu-1',
        desc: 'Quần legging thoải mái cho tập luyện',
        price: 249000,
        originPrice: 399000,
        stock: 40,
        image: 'https://via.placeholder.com/300x400?text=Quan+Legging+Nu',
        isActive: true,
      },
    }),

    // Giày category products
    prisma.product.create({
      data: {
        categoryId: categories[2].id,
        name: 'Giày sneaker trắng',
        slug: 'giay-sneaker-trang-1',
        desc: 'Giày sneaker cổ điển, phù hợp mặc hàng ngày',
        price: 699000,
        originPrice: 999000,
        stock: 35,
        image: 'https://via.placeholder.com/300x400?text=Giay+Sneaker',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[2].id,
        name: 'Giày boot da đen',
        slug: 'giay-boot-da-den-1',
        desc: 'Giày boot da cao cấp, sang trọng',
        price: 1299000,
        originPrice: 1799000,
        stock: 15,
        image: 'https://via.placeholder.com/300x400?text=Giay+Boot+Da',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[2].id,
        name: 'Dép sandal mùa hè',
        slug: 'dep-sandal-mua-he-1',
        desc: 'Dép sandal thoáng khí, nhẹ nhàng',
        price: 149000,
        originPrice: 249000,
        stock: 60,
        image: 'https://via.placeholder.com/300x400?text=Dep+Sandal',
        isActive: true,
      },
    }),

    // Phụ kiện category products
    prisma.product.create({
      data: {
        categoryId: categories[3].id,
        name: 'Mũ thời trang',
        slug: 'mu-thoi-trang-1',
        desc: 'Mũ baseball phong cách, chắn nắng',
        price: 99000,
        originPrice: 179000,
        stock: 70,
        image: 'https://via.placeholder.com/300x400?text=Mu+Thoi+Trang',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[3].id,
        name: 'Túi xách nữ',
        slug: 'tui-xach-nu-1',
        desc: 'Túi xách da cao cấp, tiện lợi',
        price: 899000,
        originPrice: 1299000,
        stock: 20,
        image: 'https://via.placeholder.com/300x400?text=Tui+Xach+Nu',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[3].id,
        name: 'Khăn choàng lụa',
        slug: 'khan-choang-lua-1',
        desc: 'Khăn choàng lụa mềm mại, dễ kết hợp',
        price: 149000,
        originPrice: 249000,
        stock: 50,
        image: 'https://via.placeholder.com/300x400?text=Khan+Choang+Lua',
        isActive: true,
      },
    }),
  ]);

  console.log(`✓ Tạo ${products.length} sản phẩm`);

  // 5. Create Cart for user
  console.log('🛒 Tạo giỏ hàng...');

  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
    },
  });

  // Add items to cart
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: products[0].id,
      quantity: 2,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: products[3].id,
      quantity: 1,
    },
  });

  console.log('✓ Tạo giỏ hàng với 2 mặt hàng');

  // 6. Create Sample Orders
  console.log('📋 Tạo đơn hàng mẫu...');

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'CONFIRMED',
      totalPrice: products[0].price * 2 + products[1].price,
      shippingAddr: '123 Đường ABC, Phường 1, Quận 1, TP HCM',
      phoneNumber: '0987654321',
      note: 'Giao hàng nhanh nếu được',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: products[0].id,
      quantity: 2,
      price: products[0].price,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: products[1].id,
      quantity: 1,
      price: products[1].price,
    },
  });

  console.log(`✓ Tạo 1 đơn hàng với 2 mục`);

  // 7. Create Audit Logs
  console.log('📝 Tạo audit log...');

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'created',
      entity: 'user',
      entityId: user.id,
      newValues: JSON.stringify({
        email: user.email,
        fullName: user.fullName,
      }),
    },
  });

  console.log('✓ Ghi nhận audit log');

  console.log('\n✨ Seed dữ liệu hoàn tất!');
  console.log('\n📊 Tóm tắt:');
  console.log(`  - 2 tài khoản (1 admin, 1 user)`);
  console.log(`  - 4 danh mục sản phẩm`);
  console.log(`  - 12 sản phẩm`);
  console.log(`  - 1 giỏ hàng với 2 mục`);
  console.log(`  - 1 đơn hàng với 2 mục`);
  console.log(`  - 1 audit log`);
  console.log('\n🔑 Tài khoản test:');
  console.log(`  Admin: admin@ltwnc.tech / Admin@123`);
  console.log(`  User: user@ltwnc.tech / User@123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
