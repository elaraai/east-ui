import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'process.argv': '[]',
  },
  optimizeDeps: {
    include: ['sorted-btree', '@elaraai/east', '@elaraai/east-ui', '@elaraai/east-ui-platform', 'react-dom/client', '@chakra-ui/react'],
  },
  server: {
    port: 3000,
    host: true,
  },
});
