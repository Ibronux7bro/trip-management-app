// Test script to check auth configuration
const { authConfig } = require('./src/lib/auth-config.ts');

console.log('Auth Config:', authConfig);
console.log('Providers:', authConfig.providers);
console.log('Session:', authConfig.session);
console.log('Secret:', authConfig.secret ? 'Set' : 'Not set');
