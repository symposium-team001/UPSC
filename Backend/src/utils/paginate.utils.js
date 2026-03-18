/**
 * Universal pagination utility for Mongoose models
 * @param {import('mongoose').Model} model - The Mongoose model to query
 * @param {Object} query - Filter object for the query
 * @param {Object} options - Pagination and sorting options
 * @param {number} [options.page=1] - Current page number
 * @param {number} [options.limit=20] - Number of items per page (Max 50)
 * @param {Object|string} [options.sort] - Sorting criteria
 * @param {string|Object} [options.populate] - Population options
 * @returns {Promise<{data: Array, page: number, limit: number, total: number, totalPages: number}>}
 */
export const paginate = async (model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const requestedLimit = parseInt(options.limit, 10) || 20;
  
  // Hard cap limit at 50 for security and performance
  const limit = Math.min(50, Math.max(1, requestedLimit));
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    model.countDocuments(query),
    model.find(query)
      .sort(options.sort || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(options.populate || '')
      .lean()
      .exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
};
