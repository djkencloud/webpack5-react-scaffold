module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
    babelOptions: {
      configFile: './babel.config.json',
    },
  },
  plugins: ['prettier', 'styled-components-a11y'],
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:styled-components-a11y/recommended',
    'prettier', // always make sure prettier is last
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-nested-ternary': 'off',
    'react/jsx-props-no-spreading': 'off',
    radix: 'off',
    indent: 'off',
    'no-console': 'off',
    'no-restricted-exports': 'off',
    'default-param-last': 'off',
    'react/prop-types': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
        packageDir: ['./', './packages/*'],
      },
    ],
    'prefer-destructuring': ['error', { object: false, array: false }],
  },
  env: {
    browser: true,
    node: true,
  },
};
