import { redis } from '../redis/config';

export const setCache = async (key: string, value: string, expiresInSeconds: number): Promise<void> => {
  await redis.set(key, value, 'EX', expiresInSeconds);
};

export const getCache = async (key: string): Promise<string | null> => {
  return await redis.get(key);
};