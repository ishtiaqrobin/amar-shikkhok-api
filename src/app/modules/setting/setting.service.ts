import { prisma } from "../../lib/prisma";

const getSetting = async (key: string) => {
  const setting = await prisma.platformSetting.findUnique({
    where: { key },
  });
  return setting?.value;
};

const updateSetting = async (key: string, value: string) => {
  const setting = await prisma.platformSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return setting;
};

const getAllSettings = async () => {
  const settings = await prisma.platformSetting.findMany();
  return settings;
};

export const SettingService = {
  getSetting,
  updateSetting,
  getAllSettings,
};
