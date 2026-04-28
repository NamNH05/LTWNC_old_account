import { Router } from "express";
import { gatewayController } from "./gateway.controller";
import { authRouter } from "../auth";
import { userRouter } from "../user";
import { productRouter } from "../product";
import { cartRouter } from "../cart";
import { orderRouter } from "../order";

export const apiGatewayRouter = Router();

apiGatewayRouter.get("/gateway/health", gatewayController.health);
apiGatewayRouter.get("/gateway/metrics", gatewayController.metrics);

apiGatewayRouter.use("/auth", authRouter);
apiGatewayRouter.use("/users", userRouter);
apiGatewayRouter.use("/products", productRouter);
apiGatewayRouter.use("/cart", cartRouter);
apiGatewayRouter.use("/orders", orderRouter);
