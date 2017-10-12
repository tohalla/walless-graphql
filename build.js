const fs = require('fs');
const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');

const pkg = require('./package.json');

let promise = Promise.resolve();

promise = promise.then(() => del(['dist/*']));

['es', 'cjs', 'umd'].forEach(format => {
  promise = promise.then(() => rollup.rollup({
    input: 'src/index.js',
    external: Object.keys(pkg.dependencies),
    plugins: [babel(Object.assign(pkg.babel, {
      babelrc: false,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      presets: pkg.babel.presets.map(x => (x === 'latest' ? ['latest', { env: { modules: false } }] : x))
    }))],
  }).then(bundle => bundle.write({
    file: `dist/${format === 'cjs' ? 'index' : `index.${format}`}.js`,
    format,
    sourcemap: false,
    name: format === 'umd' ? pkg.name : undefined,
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
