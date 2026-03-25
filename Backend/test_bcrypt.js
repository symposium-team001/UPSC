import bcrypt from 'bcrypt';
console.log('🔄 Starting bcrypt hash test...');
const start = Date.now();
bcrypt.hash('test123456', 10)
  .then(hash => {
    console.log(`✅ Bcrypt OK: ${hash}`);
    console.log(`⏱️ Took ${Date.now() - start}ms`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Bcrypt Failed:', err);
    process.exit(1);
  });
