import { NextFunction, Request, Response } from "express";
import { announcementService } from "./announcement.service";

export const announcementController = {
  async listAnnouncements(_req: Request, res: Response, next: NextFunction) {
    try {
      const announcements = await announcementService.listAnnouncements();
      res.json({
        message: "Lấy danh sách thông báo mẫu thành công",
        data: announcements,
      });
    } catch (error) {
      next(error);
    }
  },

  async getActiveAnnouncement(_req: Request, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.getActiveAnnouncement();
      res.json({
        message: "Lấy thông báo đang hoạt động thành công",
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  },
};
