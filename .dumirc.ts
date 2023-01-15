import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  alias: {
    'rc-table$': path.resolve('src'),
    'rc-table/es': path.resolve('src'),
  },
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Table',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
});
