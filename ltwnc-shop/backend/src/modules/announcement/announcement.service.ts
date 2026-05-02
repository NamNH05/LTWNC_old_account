export interface AnnouncementItem {
  id: number;
  title: string;
  summary: string;
  isActive: boolean;
  publishedAt: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 1,
    title: "Module mẫu đã sẵn sàng",
    summary: "Đây là module tham chiếu để copy khi tạo tính năng mới.",
    isActive: true,
    publishedAt: "2026-05-02T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Manifest module đã được chuẩn hóa",
    summary: "Mỗi module mới có thể đi theo cùng một hợp đồng metadata.",
    isActive: false,
    publishedAt: "2026-05-02T00:00:00.000Z",
  },
];

export const announcementService = {
  async listAnnouncements(): Promise<AnnouncementItem[]> {
    return ANNOUNCEMENTS;
  },

  async getActiveAnnouncement(): Promise<AnnouncementItem | null> {
    return ANNOUNCEMENTS.find((announcement) => announcement.isActive) ?? null;
  },
};
