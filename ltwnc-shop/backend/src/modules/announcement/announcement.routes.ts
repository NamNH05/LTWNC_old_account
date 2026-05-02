import { Router } from "express";
import { checkModuleEnabled } from "../../middlewares/module.middleware";
import { announcementController } from "./announcement.controller";

const announcementRouter = Router();

announcementRouter.use(checkModuleEnabled("announcement"));
announcementRouter.get("/", announcementController.listAnnouncements);
announcementRouter.get("/active", announcementController.getActiveAnnouncement);

export default announcementRouter;
