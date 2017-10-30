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

const external = Object.assign(
  Object.keys(pkg.dependencies).slice(),
  {[Object.keys(pkg.dependencies).indexOf('lodash')]: 'lodash/fp'}
);

Promise.resolve()
  .then(() => del(['dist/*']))
  .then(() => rollup.rollup({
    input: 'src/index.js',
    external,
    onwarn: warning =>
      warning.code === 'THIS_IS_UNDEFINED' || console.warn(warning.message),
    plugins: [
      resolve({jsnext: true, browser: true}),
      commonjs(),
      babel
    ]
  }))
  .then(bundle => Promise.all([
    bundle.write({
      file: pkg.main,
      format: 'cjs',
      globals: {
        'lodash/fp': '_'
      }
    }),
    bundle.write({
      file: pkg.module,
      format: 'es',
      globals: {
        'lodash/fp': '_'
      },
      sourcemap: false
    })
  ]))
  .then(() => {
    delete pkg.private;
    delete pkg.devDependencies;
    delete pkg.scripts;
    delete pkg.eslintConfig;
    delete pkg.babel;
    fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf-8');
  })
  .catch(err => console.error(err.stack));
