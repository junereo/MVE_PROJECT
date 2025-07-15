import { Request, Response } from 'express';
import {
  getAllSettingsService,
  upsertSettingService,
} from '../services/setting.service';

export const getAllSettingsController = async (req: Request, res: Response) => {
  try {
    const settings = await getAllSettingsService();
    res.json(settings);
  } catch (err) {
    console.error('[Settings] GET error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateSettingController = async (req: Request, res: Response) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    res.status(400).json({ message: 'Missing key or value' });
    return;
  }

  try {
    const updatedSetting = await upsertSettingService(key, value);
    res.json(updatedSetting);
  } catch (err) {
    console.error('[Settings] PATCH error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
