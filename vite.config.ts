import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Fallback to empty string to ensure replacement happens even if env var is missing
        'process.env.API_KEY': JSON.stringify(env.AIzaSyAwgetKf4jEM6xd8V_bzDiB1jXbAPJOAzg || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.AIzaSyBzu3LX9gsKcmC1oZdUEbvygRYLhjvrA9A || ''),
        'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL=https://dsrufuqpdwonwxxwmcgd.supabase.co|| ''),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY=sb_publishable_qrlKQYJiZi3g79okc67Eog_rGypB_B5 || ''),
        // Polyfill process.env to prevent crash if accessed directly
        'process.env': {}
      },
      resolve: {
        alias: {
          '@': path.resolve('.'),
        }
      }
    };
});
