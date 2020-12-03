export default {
  cjs: 'babel',
  esm: { type: 'babel', importLibToEs: true },
  runtimeHelpers: true,
  preCommit: {
    eslint: true,
    prettier: true,
  },
};
