export default () => 15;

export const getTargetScrollBarSize = (target: HTMLElement) => {
  if (!target || !(target instanceof Element)) {
    return { width: 0, height: 0 };
  }
  return { width: 15, height: 15 };
};
