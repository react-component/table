
/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import Markdown from 'react-markdown';
import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withViewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import DebugSource from 'rc-source-loader!../examples/debug';
import SimpleSource from 'rc-source-loader!../examples/simple';
import Debug from '../examples/debug';
import Simple from '../examples/simple';
import READMECode from '../README.md';
storiesOf('rc-table', module)
.addDecorator(checkA11y) 
.addDecorator(withInfo)
.addDecorator((storyFn, context) => withConsole()(storyFn)(context))
.addDecorator(withViewport())
.add(
  'readMe',
  () => (
    <div
      className="markdown-body entry-content"
      style={{
        padding: 24,
      }}
    >
      <Markdown escapeHtml={false} source={READMECode} />
    </div>
  ),
  {
    source: {
      code: READMECode,
    },
  },
)
.add('debug', () => <Debug />,{
      source: {
        code: DebugSource,
      },
    })
.add('simple', () => <Simple />,{
      source: {
        code: SimpleSource,
      },
    })
