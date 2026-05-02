import { PrismaClient } from "@prisma/client";
import {
  type ModuleCatalogItem,
  getModuleManifest,
  MODULE_MANIFESTS,
} from "../modules/module.registry";

const prisma = new PrismaClient();

export class ModuleService {
  static async getModuleStatus(moduleName: string): Promise<boolean> {
    const manifest = getModuleManifest(moduleName);
    const setting = await prisma.moduleSetting.findUnique({
      where: { name: moduleName },
    });

    if (setting) {
      return setting.isEnabled;
    }

    return manifest ? manifest.defaultEnabled : true;
  }

  static async setModuleStatus(moduleName: string, isEnabled: boolean): Promise<void> {
    await prisma.moduleSetting.upsert({
      where: { name: moduleName },
      update: { isEnabled },
      create: { name: moduleName, isEnabled },
    });
  }

  static async getModuleCatalog(): Promise<ModuleCatalogItem[]> {
    const settings = await prisma.moduleSetting.findMany();
    const settingsMap = new Map(settings.map((setting) => [setting.name, setting] as const));

    const catalog = MODULE_MANIFESTS.map((manifest) => {
      const setting = settingsMap.get(manifest.name);

      return {
        ...manifest,
        isEnabled: setting ? setting.isEnabled : manifest.defaultEnabled,
        hasStoredSetting: Boolean(setting),
      };
    });

    for (const setting of settings) {
      if (!catalog.some((item) => item.name === setting.name)) {
        catalog.push({
          name: setting.name,
          label: setting.name,
          description: "Module được lưu trong database nhưng chưa có manifest chuẩn.",
          category: "sample",
          defaultEnabled: true,
          entryPoint: "unknown",
          routes: [],
          isEnabled: setting.isEnabled,
          hasStoredSetting: true,
        });
      }
    }

    return catalog;
  }

  static async getAllModuleStatuses(): Promise<Record<string, boolean>> {
    const catalog = await this.getModuleCatalog();
    return catalog.reduce<Record<string, boolean>>((statuses, module) => {
      statuses[module.name] = module.isEnabled;
      return statuses;
    }, {});
  }
}