import authRoutes from './modules/auth/auth.routes.js';
import { verifyToken } from './middlewares/auth.middleware.js';
import { checkRole } from './middlewares/role.middleware.js';
import { requirePremium } from './middlewares/subscription.middleware.js';
import { signup, login, refreshTokens, logout } from './modules/auth/auth.service.js';

console.log('✅ Auth modules imported successfully without syntax or reference errors.');
process.exit(0);
