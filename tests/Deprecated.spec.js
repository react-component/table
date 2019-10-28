import React from 'react';
import { mount } from 'enzyme';
import { resetWarned } from 'rc-util/lib/warning';
import Table from '../src';

describe('Table.Deprecated', () => {
  let errorSpy;

  beforeAll(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
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
  });
});
