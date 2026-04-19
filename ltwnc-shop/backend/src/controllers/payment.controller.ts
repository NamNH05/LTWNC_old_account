import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services/payment.service";
import { HttpError } from "../utils/http-error";

// Controller quản lý thanh toán
export const paymentController = {
  // Lấy danh sách phương thức thanh toán
  async getPaymentMethods(req: Request, res: Response, next: NextFunction) {
    try {
      const methods = await paymentService.getPaymentMethods();

      res.json({
        message: "Lấy danh sách phương thức thanh toán thành công",
        data: methods,
      });
    } catch (error) {
      next(error);
    }
  },

  // Lấy danh sách thanh toán của người dùng
  async getMyPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpError(401, "Không thể xác định người dùng", "UNAUTHORIZED");
      }

      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      const result = await paymentService.listPaymentsByUser(userId, skip, limit);

      res.json({
        message: "Lấy danh sách thanh toán thành công",
        data: result.payments,
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

  // Tạo thanh toán mới
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpError(401, "Không thể xác định người dùng", "UNAUTHORIZED");
      }

      const { orderId, methodCode, amount } = req.body;

      // Validate dữ liệu bắt buộc
      if (!orderId || !methodCode || !amount) {
        throw new HttpError(
          400,
          "Vui lòng cung cấp: orderId, methodCode, amount",
          "VALIDATION_ERROR"
        );
      }

      if (typeof amount !== "number" || amount <= 0) {
        throw new HttpError(400, "Số tiền thanh toán phải lớn hơn 0", "VALIDATION_ERROR");
      }

      const payment = await paymentService.createPayment(userId, {
        orderId,
        methodCode,
        amount,
      });

      res.status(201).json({
        message: "Tạo thanh toán thành công",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  // Lấy chi tiết thanh toán
  async getPaymentDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpError(401, "Không thể xác định người dùng", "UNAUTHORIZED");
      }

      const paymentId = req.params.paymentId;
      if (!paymentId || isNaN(parseInt(paymentId))) {
        throw new HttpError(400, "ID thanh toán không hợp lệ", "VALIDATION_ERROR");
      }

      const payment = await paymentService.getPaymentDetail(userId, parseInt(paymentId));

      res.json({
        message: "Lấy chi tiết thanh toán thành công",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  // Admin: Lấy danh sách tất cả thanh toán
  async getAllPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      const result = await paymentService.listAllPayments(skip, limit);

      res.json({
        message: "Lấy danh sách thanh toán thành công",
        data: result.payments,
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
};
