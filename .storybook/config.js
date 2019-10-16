
import { configure, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withOptions } from '@storybook/addon-options';
import withSource from 'storybook-addon-source';

function loadStories() {
  require('/Users/jilin/projects/antd/rc-table/.storybook/index.js');
}

addDecorator(withNotes);
addDecorator(withSource);

addDecorator(
  withOptions({
    name: 'rc-table',
    url: 'http://github.com/react-component/table',
    title:'rc-table'
  })
);

configure(loadStories, module);