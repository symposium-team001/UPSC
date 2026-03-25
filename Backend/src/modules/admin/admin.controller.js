import * as adminService from './admin.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  sendSuccess(res, stats, 'Dashboard stats fetched successfully');
});
