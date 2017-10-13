/* eslint-disable import/no-commonjs */
const fs = require('fs');
const del = require('del');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const pkg = require('./package.json');
const babel = require('rollup-plugin-babel')(
  Object.assign(pkg.babel, {
    babelrc: false,
    exclude: 'node_modules/**',
    runtimeHelpers: true
  })
);

let promise = Promise.resolve();

promise = promise.then(() => del(['dist/*']));

const external = Object.assign(
  Object.keys(pkg.dependencies).slice(),
  {[Object.keys(pkg.dependencies).indexOf('lodash')]: 'lodash/fp'}
);

['es', 'cjs', 'umd'].forEach(format => {
  promise = promise.then(() => rollup.rollup({
    input: 'src/index.js',
    external,
    onwarn: warning =>
      warning.code === 'THIS_IS_UNDEFINED' || console.warn(warning.message),
    plugins: [
      resolve(),
      commonjs(),
      babel
    ]
  }).then(bundle => bundle.write({
    file: `dist/${format === 'cjs' ? 'index' : `index.${format}`}.js`,
    format,
    sourcemap: false,
    name: format === 'umd' ? pkg.name : undefined
  })));
});

promise = promise.then(() => {
  delete pkg.private;
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg.eslintConfig;
  delete pkg.babel;
  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf-8');
});

promise.catch(err => console.error(err.stack)); // eslint-disable-line no-console
