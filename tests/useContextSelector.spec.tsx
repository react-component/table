import { mount } from 'enzyme';
import { createContext, useContextSelector } from '../src/ContextSelector';

describe('Table.useContextSelector', () => {
  it('one render', () => {
    let renderTimes = 0;
    const Context = createContext<number>();

    const Sub = ({ children }: { children?: React.ReactNode }) => {
      useContextSelector(Context, value => value);
      return <>{children}</>;
    };

    const Final = () => {
      renderTimes += 1;
      return <>{useContextSelector(Context, value => value)}</>;
    };

    const Demo = ({ num }: { num: number }) => {
      return (
        <Context.Provider value={num}>
          <Sub>
            <Final />
          </Sub>
        </Context.Provider>
      );
    };

    const wrapper = mount(<Demo num={0} />);
    expect(renderTimes).toEqual(1);

    // Rerender should only render once
    wrapper.setProps({ num: 1 });
    expect(renderTimes).toEqual(2);
  });
});
