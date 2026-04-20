import { prisma } from "../models/prisma";
import { HttpError } from "../utils/http-error";

// Service quản lý thanh toán
export const paymentService = {
  // Lấy danh sách phương thức thanh toán
  async getPaymentMethods() {
    const methods = await prisma.paymentMethod.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return methods;
  },

  // Lấy danh sách thanh toán của người dùng
  async listPaymentsByUser(userId: number, skip: number, take: number) {
    // Note: Chúng ta cần thêm Payment model vào Prisma schema nếu chưa có
    // Hiện tại sẽ return mock data hoặc error nếu chưa có Payment table
    
    try {
      const payments = await prisma.$queryRaw`
        SELECT p.* FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE o.user_id = ${userId}
        ORDER BY p.created_at DESC
        LIMIT ${take} OFFSET ${skip}
      `;

      const total = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE o.user_id = ${userId}
      `;

      return {
        payments: payments || [],
        total: (total as any)?.[0]?.count || 0,
      };
    } catch (error) {
      // Nếu table chưa tồn tại, return empty list
      return { payments: [], total: 0 };
    }
  },

  // Tạo thanh toán mới
  async createPayment(
    userId: number,
    data: {
      orderId: number;
      methodCode: string;
      amount: number;
    }
  ) {
    // Kiểm tra order có tồn tại và thuộc về user không
    const order = await prisma.order.findFirst({
      where: {
        id: data.orderId,
        userId,
        deletedAt: null,
      },
    });

    if (!order) {
      throw new HttpError(404, "Đơn hàng không tồn tại", "NOT_FOUND");
    }

    // Kiểm tra phương thức thanh toán có hợp lệ không
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        code: data.methodCode,
        isActive: true,
      },
    });

    if (!paymentMethod) {
      throw new HttpError(400, "Phương thức thanh toán không hợp lệ", "VALIDATION_ERROR");
    }

    // Kiểm tra số tiền thanh toán có khớp không
    if (data.amount !== order.totalPrice) {
      throw new HttpError(
        400,
        `Số tiền thanh toán không khớp. Yêu cầu: ${order.totalPrice}, nhận: ${data.amount}`,
        "VALIDATION_ERROR"
      );
    }

    // Tạo payment (hiện tại sử dụng raw query vì Payment model chưa được định nghĩa đầy đủ)
    try {
      const payment = await prisma.$queryRaw`
        INSERT INTO payments (order_id, amount, status, method, created_at, updated_at)
        VALUES (${data.orderId}, ${data.amount}, 'PENDING', ${data.methodCode}, NOW(), NOW())
        RETURNING *
      `;

      return payment;
    } catch (error) {
      throw new HttpError(500, "Lỗi tạo thanh toán", "INTERNAL_ERROR");
    }
  },

  // Lấy chi tiết thanh toán
  async getPaymentDetail(userId: number, paymentId: number) {
    try {
      const payment = await prisma.$queryRaw`
        SELECT p.* FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE p.id = ${paymentId} AND o.user_id = ${userId}
      `;

      if (!payment || (payment as any[]).length === 0) {
        throw new HttpError(404, "Thanh toán không tồn tại", "NOT_FOUND");
      }

      return (payment as any[])[0];
    } catch (error) {
      throw new HttpError(404, "Thanh toán không tồn tại", "NOT_FOUND");
    }
  },

  // Admin: Lấy danh sách tất cả thanh toán
  async listAllPayments(skip: number, take: number) {
    try {
      const payments = await prisma.$queryRaw`
        SELECT p.*, o.user_id FROM payments p
        JOIN orders o ON p.order_id = o.id
        ORDER BY p.created_at DESC
        LIMIT ${take} OFFSET ${skip}
      `;

      const total = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM payments
      `;

      return {
        payments: payments || [],
        total: (total as any)?.[0]?.count || 0,
      };
    } catch (error) {
      return { payments: [], total: 0 };
    }
  },
};
