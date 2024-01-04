module.exports = {
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['packages/*/build.mjs'],
      },
    ],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: ['node_modules', 'dist', '.eslintrc.js'],
}
