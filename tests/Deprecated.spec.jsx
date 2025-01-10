import { mount } from 'enzyme';
import { resetWarned } from '@rc-component/util/lib/warning';
import React from 'react';
import Table from '../src';

describe('Table.Deprecated', () => {
  let errorSpy;

  beforeAll(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    resetWarned();
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  describe('warning', () => {
    it('renders table body to the wrapper', () => {
      const getBodyWrapper = body => (
        <tbody className="custom-wrapper">{body.props.children}</tbody>
      );
      mount(<Table getBodyWrapper={getBodyWrapper} />);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `getBodyWrapper` is deprecated, please use custom `components` instead.',
      );
    });

    ['onRowClick', 'onRowDoubleClick', 'onRowMouseEnter', 'onRowMouseLeave'].forEach(
      removedProp => {
        it(`warning for '${removedProp}'`, () => {
          const props = {
            [removedProp]: vi.fn(),
          };
          mount(<Table {...props} />);

          expect(errorSpy.mock.calls[0][0].includes(removedProp)).toBeTruthy();
        });
      },
    );
  });
});
