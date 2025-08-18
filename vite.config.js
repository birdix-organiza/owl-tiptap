import path from 'path';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import eslintPlugin from 'vite-plugin-eslint2';
import fs from 'fs';

// Custom plugin to handle SVG raw imports
const svgRawPlugin = () => {
  return {
    name: 'svg-raw',
    load(id) {
      if (id.endsWith('?raw')) {
        const filePath = id.slice(0, -4); // Remove ?raw suffix
        if (filePath.endsWith('.svg')) {
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            return `export default ${JSON.stringify(content)};`;
          } catch (error) {
            console.warn(`Could not load SVG file: ${filePath}`);
            return 'export default "";';
          }
        }
      }
      return null;
    },
  };
};

export default defineConfig({
  root: './test',
  plugins: [
    svgRawPlugin(),
    eslintPlugin({
      include: ['src/**/*.{js}', 'test/**/*.{js}'],
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },
  hmr: {
    overlay: {
      warnings: false, // 关闭警告覆盖
      errors: true, // 保留错误覆盖
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.json'],
  },
});
