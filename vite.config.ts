import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts'; 

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ReactRealtimePreview',
      fileName: (format) => `index.${format}.js`, // Outputs index.cjs.js and index.es.js
      formats: ['es', 'cjs'], // Generate both ES Modules and CommonJS
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'markdown-it', '@shikijs/markdown-it'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});