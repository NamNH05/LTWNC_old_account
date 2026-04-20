import crypto from "crypto";
import { env } from "../config/env";
import { prisma } from "../models/prisma";
import { HttpError } from "../utils/http-error";

type PaymentRow = {
  id: number;
  order_id: number;
  amount: number | string;
  payment_method: string | null;
  payment_status: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  user_id?: number;
};

type VnpayCallbackResult = {
  success: boolean;
  code: string;
  message: string;
  orderId?: number;
  paymentStatus?: string;
  transactionId?: string;
};

const formatDateGMT7 = (date: Date) => {
  const gmt7 = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const yyyy = gmt7.getUTCFullYear();
  const mm = String(gmt7.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(gmt7.getUTCDate()).padStart(2, "0");
  const hh = String(gmt7.getUTCHours()).padStart(2, "0");
  const mi = String(gmt7.getUTCMinutes()).padStart(2, "0");
  const ss = String(gmt7.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}${hh}${mi}${ss}`;
};

const encodeRFC3986 = (value: string) =>
  encodeURIComponent(value).replace(/%20/g, "+");

const buildSortedQuery = (input: Record<string, string>) => {
  return Object.keys(input)
    .sort()
    .map((key) => `${encodeRFC3986(key)}=${encodeRFC3986(input[key] ?? "")}`)
    .join("&");
};

const signVnpayData = (data: string) => {
  return crypto
    .createHmac("sha512", env.vnpayHashSecret)
    .update(Buffer.from(data, "utf-8"))
    .digest("hex");
};

const normalizePayment = (row: PaymentRow) => ({
  id: row.id,
  orderId: row.order_id,
  amount: Number(row.amount),
  method: row.payment_method,
  status: row.payment_status,
  transactionId: row.transaction_id,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  ...(typeof row.user_id === "number" ? { userId: row.user_id } : {}),
});

const normalizeCount = (rows: Array<{ count: bigint | number | string }>) => {
  const value = rows[0]?.count;
  if (typeof value === "bigint") {
    return Number(value);
  }
  if (typeof value === "number") {
    return value;
  }
  return Number(value ?? 0);
};

const normalizeQueryParams = (params: Record<string, string>) => {
  const copy: Record<string, string> = { ...params };
  delete copy.vnp_SecureHash;
  delete copy.vnp_SecureHashType;
  return copy;
};

const parseOrderIdFromTxnRef = (txnRef: string | null) => {
  if (!txnRef) {
    return null;
  }

  const raw = txnRef.split("_")[0] ?? "";
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

const validateVnpayConfig = () => {
  if (!env.vnpayTmnCode || !env.vnpayHashSecret || !env.vnpayReturnUrl || !env.vnpayIpnUrl) {
    throw new HttpError(
      500,
      "Thiếu cấu hình VNPAY. Cần VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_RETURN_URL, VNPAY_IPN_URL",
      "INTERNAL_ERROR"
    );
  }
};

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
    try {
      const payments = (await prisma.$queryRaw`
        SELECT p.* FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE o.user_id = ${userId}
        ORDER BY p.created_at DESC
        LIMIT ${take} OFFSET ${skip}
      `) as PaymentRow[];

      const total = (await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE o.user_id = ${userId}
      `) as Array<{ count: bigint | number | string }>;

      return {
        payments: payments.map(normalizePayment),
        total: normalizeCount(total),
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
      const payment = (await prisma.$queryRaw`
        INSERT INTO payments (order_id, amount, payment_status, payment_method, created_at, updated_at)
        VALUES (${data.orderId}, ${data.amount}, 'PENDING', ${data.methodCode}, NOW(), NOW())
        ON CONFLICT (order_id)
        DO UPDATE SET
          amount = EXCLUDED.amount,
          payment_status = 'PENDING',
          payment_method = EXCLUDED.payment_method,
          updated_at = NOW()
        RETURNING *
      `) as PaymentRow[];

      return normalizePayment(payment[0]);
    } catch (error) {
      throw new HttpError(500, "Lỗi tạo thanh toán", "INTERNAL_ERROR");
    }
  },

  // Lấy chi tiết thanh toán
  async getPaymentDetail(userId: number, paymentId: number) {
    try {
      const payment = (await prisma.$queryRaw`
        SELECT p.* FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE p.id = ${paymentId} AND o.user_id = ${userId}
      `) as PaymentRow[];

      if (!payment || payment.length === 0) {
        throw new HttpError(404, "Thanh toán không tồn tại", "NOT_FOUND");
      }

      return normalizePayment(payment[0]);
    } catch (error) {
      throw new HttpError(404, "Thanh toán không tồn tại", "NOT_FOUND");
    }
  },

  // Admin: Lấy danh sách tất cả thanh toán
  async listAllPayments(skip: number, take: number) {
    try {
      const payments = (await prisma.$queryRaw`
        SELECT p.*, o.user_id FROM payments p
        JOIN orders o ON p.order_id = o.id
        ORDER BY p.created_at DESC
        LIMIT ${take} OFFSET ${skip}
      `) as PaymentRow[];

      const total = (await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM payments
      `) as Array<{ count: bigint | number | string }>;

      return {
        payments: payments.map(normalizePayment),
        total: normalizeCount(total),
      };
    } catch (error) {
      return { payments: [], total: 0 };
    }
  },

  async createVnpayPaymentUrl(
    userId: number,
    data: {
      orderId: number;
      bankCode?: string;
      locale?: string;
      clientIp: string;
    }
  ) {
    validateVnpayConfig();

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

    const existingPayment = (await prisma.$queryRaw`
      SELECT * FROM payments WHERE order_id = ${order.id} LIMIT 1
    `) as PaymentRow[];

    if ((existingPayment[0]?.payment_status ?? "").toUpperCase() === "PAID") {
      throw new HttpError(409, "Đơn hàng đã thanh toán", "CONFLICT");
    }

    const now = new Date();
    const expire = new Date(now.getTime() + 15 * 60 * 1000);
    const txnRef = `${order.id}_${Date.now()}`;
    const amount = Math.round(order.totalPrice * 100);

    await prisma.$queryRaw`
      INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id, notes, created_at, updated_at)
      VALUES (
        ${order.id},
        ${order.totalPrice},
        'VNPAY',
        'PENDING',
        ${txnRef},
        ${JSON.stringify({ stage: "INIT", createdAt: now.toISOString() })},
        NOW(),
        NOW()
      )
      ON CONFLICT (order_id)
      DO UPDATE SET
        amount = EXCLUDED.amount,
        payment_method = 'VNPAY',
        payment_status = 'PENDING',
        transaction_id = EXCLUDED.transaction_id,
        notes = EXCLUDED.notes,
        updated_at = NOW()
    `;

    const vnpParams: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: env.vnpayTmnCode,
      vnp_Amount: String(amount),
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang #${order.id}`,
      vnp_OrderType: "other",
      vnp_Locale: data.locale ?? env.vnpayLocale,
      vnp_ReturnUrl: env.vnpayReturnUrl,
      vnp_IpAddr: data.clientIp,
      vnp_CreateDate: formatDateGMT7(now),
      vnp_ExpireDate: formatDateGMT7(expire),
    };

    if (data.bankCode) {
      vnpParams.vnp_BankCode = data.bankCode;
    }

    const signData = buildSortedQuery(vnpParams);
    const secureHash = signVnpayData(signData);
    const paymentUrl = `${env.vnpayUrl}?${signData}&vnp_SecureHash=${secureHash}`;

    return {
      orderId: order.id,
      txnRef,
      amount: order.totalPrice,
      paymentUrl,
      expiredAt: expire.toISOString(),
    };
  },

  async handleVnpayCallback(params: Record<string, string>): Promise<VnpayCallbackResult> {
    validateVnpayConfig();

    const receivedHash = params.vnp_SecureHash;
    if (!receivedHash) {
      return { success: false, code: "97", message: "Missing secure hash" };
    }

    const normalized = normalizeQueryParams(params);
    const signData = buildSortedQuery(normalized);
    const expectedHash = signVnpayData(signData);

    if (expectedHash.toLowerCase() !== receivedHash.toLowerCase()) {
      return { success: false, code: "97", message: "Invalid signature" };
    }

    const txnRef = normalized.vnp_TxnRef ?? null;
    const responseCode = normalized.vnp_ResponseCode ?? "99";
    const transactionNo = normalized.vnp_TransactionNo ?? null;
    const amountFromGateway = Number(normalized.vnp_Amount ?? "0") / 100;

    let paymentRows = (await prisma.$queryRaw`
      SELECT * FROM payments WHERE transaction_id = ${txnRef} LIMIT 1
    `) as PaymentRow[];

    if (paymentRows.length === 0) {
      const orderIdFromRef = parseOrderIdFromTxnRef(txnRef);
      if (!orderIdFromRef) {
        return { success: false, code: "01", message: "Payment not found" };
      }

      paymentRows = (await prisma.$queryRaw`
        SELECT * FROM payments WHERE order_id = ${orderIdFromRef} LIMIT 1
      `) as PaymentRow[];
    }

    const payment = paymentRows[0];
    if (!payment) {
      return { success: false, code: "01", message: "Payment not found" };
    }

    if (Math.abs(Number(payment.amount) - amountFromGateway) > 0.001) {
      return { success: false, code: "04", message: "Invalid amount" };
    }

    const currentStatus = (payment.payment_status ?? "").toUpperCase();
    if (currentStatus === "PAID") {
      return {
        success: true,
        code: "00",
        message: "Already confirmed",
        orderId: payment.order_id,
        paymentStatus: payment.payment_status ?? "PAID",
        transactionId: payment.transaction_id ?? transactionNo ?? undefined,
      };
    }

    if (responseCode === "00") {
      await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`
          UPDATE payments
          SET payment_status = 'PAID',
              transaction_id = ${transactionNo ?? txnRef},
              notes = ${JSON.stringify({ gateway: "VNPAY", params: normalized })},
              updated_at = NOW()
          WHERE id = ${payment.id}
        `;

        await tx.order.updateMany({
          where: { id: payment.order_id, status: "PENDING" },
          data: { status: "CONFIRMED" },
        });
      });

      return {
        success: true,
        code: "00",
        message: "Payment success",
        orderId: payment.order_id,
        paymentStatus: "PAID",
        transactionId: transactionNo ?? txnRef ?? undefined,
      };
    }

    await prisma.$queryRaw`
      UPDATE payments
      SET payment_status = 'FAILED',
          transaction_id = ${transactionNo ?? txnRef},
          notes = ${JSON.stringify({ gateway: "VNPAY", params: normalized })},
          updated_at = NOW()
      WHERE id = ${payment.id}
    `;

    return {
      success: false,
      code: responseCode,
      message: "Payment failed",
      orderId: payment.order_id,
      paymentStatus: "FAILED",
      transactionId: transactionNo ?? txnRef ?? undefined,
    };
  },
};
