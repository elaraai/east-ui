import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  base: '/east-ui/',
  define: {
    'process.env': {},
    'process.argv': '[]',
  },
  optimizeDeps: {
    include: ['sorted-btree', '@elaraai/east', '@elaraai/east-ui', 'react-dom/client', '@chakra-ui/react'],
  },
  server: {
    port: 3000,
    host: true,
  },
});
