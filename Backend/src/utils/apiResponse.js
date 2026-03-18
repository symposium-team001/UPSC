/**
 * Sends a standardized success response
 * @param {import('express').Response} res - Express response object
 * @param {any} data - Data to send in the response
 * @param {string} [message='Success'] - Optional success message
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {import('express').Response}
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response
 * @param {import('express').Response} res - Express response object
 * @param {string} [message='Error'] - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {Array} [errors=[]] - Optional array of specific error details
 * @returns {import('express').Response}
 */
export const sendError = (res, message = 'Error', statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: errors,
  });
};
