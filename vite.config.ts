import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Public defaults for Paombong so a deploy works without a .env file.
// A value from .env files or the hosting provider still wins.
const defaults: Record<string, string> = {
  VITE_GOVERNMENT_NAME: 'Paombong',
  VITE_GOVERNMENT_TYPE: 'Municipality',
  VITE_PROVINCE: 'Bulacan',
  VITE_REGION: 'Central Luzon',
  VITE_SITE_DESCRIPTION:
    'Community-run portal for Paombong, Bulacan. Find municipal officials, offices, services, and public information.',
  VITE_SITE_KEYWORDS:
    'paombong, bulacan, local government, municipal hall, services',
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  for (const [key, value] of Object.entries(defaults)) {
    if (!env[key]) process.env[key] = value;
  }
  return {
    plugins: [react(), tailwindcss()],
    assetsInclude: ['**/*.md'],
  };
});
