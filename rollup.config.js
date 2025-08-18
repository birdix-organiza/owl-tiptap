import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import cssnano from 'cssnano'; // CSS minification plugin
import fs from 'fs';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import svgo from 'rollup-plugin-svgo';
import json from '@rollup/plugin-json';

// Read environment variables to determine whether to perform minified compilation
const isTerse = process.env.TERSE === 'true';

const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function replaceExportsPlugin(replacement) {
  return {
    name: 'replace-exports',
    renderChunk(code) {
      let newCode = code;
      const target = '({}, window.owl);';
      if (endsWith(code.trim(), target)) {
        // Get original string length
        const originalLength = code.length;
        // Calculate new string after replacement
        newCode = code.slice(0, originalLength - target.length) + `(${replacement}, window.owl);`;
      }

      return {
        code: newCode,
        map: null, // If not handling source map, can return null
      };
    },
  };
}

function addHeaderPlugin() {
  return {
    name: 'add-header',
    renderChunk(code) {
      return {
        code: '// @odoo-module ignore\n' + code,
        map: null,
      };
    },
  };
}

const plugins = [
  addHeaderPlugin(),
  replaceExportsPlugin('window.owltiptap = window.owltiptap || {}'),
  strip({
    include: '**/*.js',
  }),
  nodeResolve(),
  commonjs(),
  json(),
  postcss({
    extract: 'owl-tiptap.min.css',
    extensions: ['.css', '.scss'],
    use: [
      [
        'sass',
        {
          includePaths: [path.resolve('.')],
        },
      ],
    ],
    plugins: [cssnano()],
  }),
  alias({
    resolve: ['.js'], // Optional, by default this will only look for .js files or folders
    entries: {
      '@': path.resolve('./src'),
    },
  }),
  url({
    include: ['**/*.png', '**/*.svg'], // Process PNG and SVG files
    limit: Infinity, // Process all files as Base64
    emitFiles: false, // Don't copy files to output directory, only process as Base64
  }),
  // Custom plugin to handle SVG raw imports
  {
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
  },
  svgo(),
];

if (isTerse) {
  plugins.push(
    terser({
      mangle: true,
      compress: {
        drop_console: true, // Remove console statements
        drop_debugger: true, // Remove debugger statements
      },
    }),
  );
}

export default {
  input: 'src/index.js',
  output: {
    file: 'build/esm/owl-tiptap.min.js',
    format: 'iife',
    globals: {
      '@odoo/owl': 'window.owl',
    },
  },
  external: ['@odoo/owl'],
  plugins,
};
