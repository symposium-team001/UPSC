/**
 * Isolation test to find which module is causing the crash
 */
import { logger } from './src/utils/logger.js';

async function testImports() {
  const modules = [
    './src/config/env.js',
    './src/config/db.js',
    './src/config/redis.js',
    './src/config/firebase.js',
    './src/utils/apiResponse.js',
    './src/utils/apiError.js',
    './src/utils/jwt.utils.js',
    './src/utils/paginate.utils.js',
    './src/modules/auth/auth.routes.js',
    './src/modules/current-affairs/current-affairs.routes.js',
    './src/modules/ai-analyst/ai-analyst.routes.js',
    './src/modules/users/users.routes.js',
    './src/modules/courses/courses.routes.js',
    './src/modules/exams/exams.routes.js',
    './src/modules/progress/progress.routes.js',
    './src/modules/subscriptions/subscriptions.routes.js',
    './src/modules/admin/admin.routes.js',
    './src/routes/index.js',
    './src/app.js'
  ];

  for (const mod of modules) {
    try {
      console.log(`🔍 Testing import: ${mod}`);
      await import(mod);
      console.log(`✅ Success: ${mod}`);
    } catch (error) {
      console.error(`❌ FAILED: ${mod}`);
      console.error(error);
      process.exit(1);
    }
  }
  console.log('✨ All imports verified successfully!');
}

testImports();
