// Package Delivery Service — Stub for progressive delivery scheduling
// TODO: Full implementation for DTC store progressive delivery
import { logger } from '../../utils/logger.js';

async function getPackagesNeedingDelivery(): Promise<any[]> {
  logger.info('packageDeliveryService.getPackagesNeedingDelivery called (stub)');
  return [];
}

async function getActiveWeeklyBoxes(): Promise<any[]> {
  logger.info('packageDeliveryService.getActiveWeeklyBoxes called (stub)');
  return [];
}

export const packageDeliveryService = {
  getPackagesNeedingDelivery,
  getActiveWeeklyBoxes,
};
