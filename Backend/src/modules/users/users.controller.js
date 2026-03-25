import * as usersService from './users.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const getMe = asyncHandler(async (req, res) => {
  const data = await usersService.getMe(req.user._id);
  sendSuccess(res, data, 'User profile fetched successfully');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await usersService.updateProfile(req.user._id, req.body);
  sendSuccess(res, profile, 'Profile updated successfully');
});
