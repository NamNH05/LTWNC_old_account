import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ModuleService {
  static async getModuleStatus(moduleName: string): Promise<boolean> {
    const setting = await prisma.moduleSetting.findUnique({
      where: { name: moduleName },
    });
    return setting ? setting.isEnabled : true; // Default to true if not found
  }

  static async setModuleStatus(moduleName: string, isEnabled: boolean): Promise<void> {
    await prisma.moduleSetting.upsert({
      where: { name: moduleName },
      update: { isEnabled },
      create: { name: moduleName, isEnabled },
    });
  }

  static async getAllModuleStatuses(): Promise<Record<string, boolean>> {
    const settings = await prisma.moduleSetting.findMany();
    const statuses: Record<string, boolean> = {};
    settings.forEach(setting => {
      statuses[setting.name] = setting.isEnabled;
    });
    return statuses;
  }
}