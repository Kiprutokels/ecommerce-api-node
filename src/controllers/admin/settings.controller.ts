// controllers/admin/settings.controller.ts
import { Request, Response } from 'express';
import { SettingsService } from '@/services/settings.service';
import { ResponseUtil } from '@/utils/response.util';

export class AdminSettingsController {
  static async get(req: Request, res: Response): Promise<void> {
    try {
      const settings = await SettingsService.getAllSettings();
      ResponseUtil.success(res, settings);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const settings = await SettingsService.updateSettings(req.body);
      ResponseUtil.success(res, settings, 'Settings updated successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }
}
