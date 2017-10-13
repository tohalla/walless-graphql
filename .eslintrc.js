module.exports = {
  settings: {
    'import/parser': 'babel-eslint',
    'import/resolver': {"babel-module": {}}
  },
  extends: [
    'google'
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  plugins: [
    'babel',
    'import'
  ],
  env: {
    node: true,
    browser: true,
    es6: true
  },
  settings: {'import/resolver': {'node': {'extensions': ['.js']}}},
  parser: 'babel-eslint',
  rules: {
    'no-invalid-this': 0,
    'no-undef': 2,
    'require-jsdoc': 0,
    'comma-dangle': [2, 'never'],
    'import/named': 2,
    'import/no-commonjs': 2,
    'import/namespace': 2,
    "space-before-function-paren": 0,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': [2, {jsx: 'never', js: 'never'}],
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-nested-ternary': 0,
    'operator-linebreak': 0,
    'generator-star-spacing': 1,
    'babel/new-cap': 1,
    'array-bracket-spacing': 1,
    'babel/object-curly-spacing': 1,
    'object-shorthand': 1,
    'no-await-in-loop': 1,
    'max-len': 0
  }
};
