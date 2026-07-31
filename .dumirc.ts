import { defineConfig } from 'dumi';
import path from 'path';

const basePath = process.env.GH_PAGES ? '/table/' : '/';
const publicPath = basePath;

export default defineConfig({
  alias: {
    '@rc-component/table$': path.resolve(__dirname, 'src'),
    '@rc-component/table/es': path.resolve(__dirname, 'src'),
    '@rc-component/dropdown/assets': path.resolve(
      __dirname,
      'node_modules/@rc-component/dropdown/assets',
    ),
    '@rc-component/menu/assets': path.resolve(__dirname, 'node_modules/@rc-component/menu/assets'),
    '@rc-component/tooltip/assets': path.resolve(
      __dirname,
      'node_modules/@rc-component/tooltip/assets',
    ),
    'rc-table$': path.resolve(__dirname, 'src'),
    'rc-table/es': path.resolve(__dirname, 'src'),
  },
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  outputPath: 'docs-dist',
  base: basePath,
  publicPath,
  themeConfig: {
    name: 'Table',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
});
