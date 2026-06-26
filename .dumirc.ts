import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  alias: {
    '@rc-component/table$': path.resolve('src'),
    '@rc-component/table/es': path.resolve('src'),
    '@rc-component/dropdown/assets': path.resolve('node_modules/@rc-component/dropdown/assets'),
    '@rc-component/menu/assets': path.resolve('node_modules/@rc-component/menu/assets'),
    '@rc-component/tooltip/assets': path.resolve('node_modules/@rc-component/tooltip/assets'),
    'rc-table$': path.resolve('src'),
    'rc-table/es': path.resolve('src'),
  },
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Table',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
});
