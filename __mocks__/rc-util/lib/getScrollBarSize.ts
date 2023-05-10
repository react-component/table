export default () => 15;

export const getTargetScrollBarSize = (target: HTMLElement) => {
  console.log("🚀 ~ file: getScrollBarSize.ts:4 ~ getTargetScrollBarSize ~ target:", target)
  if (!target || !(target instanceof Element)) {
    return { width: 0, height: 0 };
  }
  return { width: 15, height: 15 };
};
