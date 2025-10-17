module.exports = {
  // Biome formatting and linting for TypeScript/JavaScript files
  '**/*.{js,jsx,ts,tsx}': ['biome check --write', 'biome format --write'],
  // Formatting for other files
  '**/*.{json,md}': ['biome format --write'],
};
