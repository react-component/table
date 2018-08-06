import { getDataAndAriaProps } from '../src/utils';

describe('utils', () => {
  describe('getDataAndAria', () => {
    it('should return only data- and aria- properties', () => {
      const props = {
        'data-test': 'name',
        'aria-label': 'name',
        dataSource: '/api',
        ariaLabel: 'some-label',
      };
      expect(getDataAndAriaProps(props)).toEqual({
        'data-test': 'name',
        'aria-label': 'name',
      });
    });
  });
});
