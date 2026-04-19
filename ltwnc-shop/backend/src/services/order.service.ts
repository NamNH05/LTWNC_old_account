import { prisma } from "../models/prisma";
import { HttpError } from "../utils/http-error";

// Service quản lý đơn hàng
export const orderService = {
  // Lấy danh sách đơn hàng của người dùng
  async listOrdersByUser(userId: number, skip: number, take: number, status?: string) {
    const whereClause: any = {
      userId,
      deletedAt: null,
    };

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: whereClause }),
    ]);

    return { orders, total };
  },

  // Tạo đơn hàng mới
  async createOrder(
    userId: number,
    data: {
      shippingAddr: string;
      phoneNumber: string;
      note?: string;
      items: Array<{ productId: number; quantity: number }>;
    }
  ) {
    // Validate items
    if (!data.items || data.items.length === 0) {
      throw new HttpError(400, "Đơn hàng phải có ít nhất 1 sản phẩm", "VALIDATION_ERROR");
    }

    // Tính tổng giá
    let totalPrice = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(String(item.productId), 10) },
      });

      if (!product) {
        throw new HttpError(404, `Sản phẩm ${item.productId} không tồn tại`, "NOT_FOUND");
      }

      if (product.stock < item.quantity) {
        throw new HttpError(400, `Sản phẩm ${product.name} không đủ tồn kho`, "VALIDATION_ERROR");
      }

      totalPrice += product.price * item.quantity;
      orderItems.push({
        productId: parseInt(String(item.productId), 10),
        quantity: parseInt(String(item.quantity), 10),
        price: product.price,
      });
    }

    // Tạo đơn hàng
    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        totalPrice,
        shippingAddr: data.shippingAddr,
        phoneNumber: data.phoneNumber,
        note: data.note,
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return order;
  },

  // Lấy chi tiết đơn hàng
  async getOrderDetail(userId: number, orderId: number) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new HttpError(404, "Đơn hàng không tồn tại", "NOT_FOUND");
    }

    return order;
  },

  // Admin: Lấy danh sách tất cả đơn hàng
  async listAllOrders(skip: number, take: number, status?: string, userId?: number) {
    const whereClause: any = {
      deletedAt: null,
    };

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    if (userId) {
      whereClause.userId = userId;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: whereClause }),
    ]);

    return { orders, total };
  },

  // Admin: Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId: number, status: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpError(404, "Đơn hàng không tồn tại", "NOT_FOUND");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return updatedOrder;
  },

  // Admin: Hủy đơn hàng (soft delete)
  async cancelOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpError(404, "Đơn hàng không tồn tại", "NOT_FOUND");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { deletedAt: new Date() },
    });
  },
};
