import { Request, Response, NextFunction } from 'express';
import { ModuleService } from '../services/module.service';

export const checkModuleEnabled = (moduleName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isEnabled = await ModuleService.getModuleStatus(moduleName);
      if (!isEnabled) {
        return res.status(403).json({
          success: false,
          message: `Module ${moduleName} is currently disabled.`,
        });
      }
      next();
    } catch (error) {
      console.error('Error checking module status:', error);
      // In case of error, allow the request to proceed
      next();
    }
  };
};