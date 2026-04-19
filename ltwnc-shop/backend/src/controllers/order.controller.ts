import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service";
import { HttpError } from "../utils/http-error";

// Controller quản lý đơn hàng
export const orderController = {
  // Lấy danh sách đơn hàng của người dùng hiện tại
  async listMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpError(401, "Không thể xác định người dùng");
      }

      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      const status = req.query.status as string | undefined;

      const result = await orderService.listOrdersByUser(userId, skip, limit, status);

      res.json({
        message: "Lấy danh sách đơn hàng thành công",
        data: result.orders,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Tạo đơn hàng mới
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpError(401, "Không thể xác định người dùng");
      }

      const { shippingAddr, phoneNumber, note, items } = req.body;

      // Validate dữ liệu bắt buộc
      if (!shippingAddr || !phoneNumber || !items || !Array.isArray(items) || items.length === 0) {
        throw new HttpError(400, "Vui lòng cung cấp: shippingAddr, phoneNumber, items[]");
      }

      // Convert productId to Int
      const parsedItems = items.map((item: any) => ({
        productId: parseInt(String(item.productId), 10),
        quantity: parseInt(String(item.quantity), 10),
      }));

      const order = await orderService.createOrder(userId, {
        shippingAddr,
        phoneNumber,
        note,
        items: parsedItems,
      });

      res.status(201).json({
        message: "Tạo đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  // Lấy chi tiết đơn hàng
  async getOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpError(401, "Không thể xác định người dùng");
      }

      const orderId = String(req.params.orderId);
      if (!orderId || isNaN(parseInt(orderId))) {
        throw new HttpError(400, "ID đơn hàng không hợp lệ");
      }

      const order = await orderService.getOrderDetail(userId, parseInt(orderId));

      res.json({
        message: "Lấy chi tiết đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  // Admin: Lấy danh sách tất cả đơn hàng
  async listAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      const status = req.query.status as string | undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

      const result = await orderService.listAllOrders(skip, limit, status, userId);

      res.json({
        message: "Lấy danh sách đơn hàng thành công",
        data: result.orders,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Admin: Cập nhật trạng thái đơn hàng
  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = String(req.params.orderId);
      if (!orderId || isNaN(parseInt(orderId))) {
        throw new HttpError(400, "ID đơn hàng không hợp lệ");
      }

      const { status } = req.body;
      if (!status) {
        throw new HttpError(400, "Vui lòng cung cấp status");
      }

      const order = await orderService.updateOrderStatus(parseInt(orderId), status);

      res.json({
        message: "Cập nhật trạng thái đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  // Admin: Hủy đơn hàng (soft delete)
  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = String(req.params.orderId);
      if (!orderId || isNaN(parseInt(orderId))) {
        throw new HttpError(400, "ID đơn hàng không hợp lệ");
      }

      await orderService.cancelOrder(parseInt(orderId));

      res.json({
        message: "Hủy đơn hàng thành công",
      });
    } catch (error) {
      next(error);
    }
  },
};
