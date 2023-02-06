const INLINE_ELEMENTS = require('eslint-plugin-vue/lib/utils/inline-non-void-elements.json');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue
    'plugin:vue/recommended',

    // https://github.com/vuejs/eslint-config-airbnb
    // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    // [Overwrites plugin:vue/recommended]
    // Enforce the maximum number of attributes per line
    // https://eslint.vuejs.org/rules/max-attributes-per-line.html
    'vue/max-attributes-per-line': ['error', {
      singleline: {max: 5},
      multiline: {max: 3},
    }],

    // [Overwrites plugin:vue/recommended]
    // Require a line break before and after the contents of a singleline element
    // https://eslint.vuejs.org/rules/singleline-html-element-content-newline.html
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignores: ['sp-link', 'sp-heading', 'sp-label', 'sp-detail', 'sp-body', 'pre', 'textarea', ...INLINE_ELEMENTS],
    }],

    // [Overwrites Airbnb]
    // We need to disable standard `max-len` because it ignores `template` from `vue/max-len`
    'max-len': 'off',
    'vue/max-len': ['error', {
      code: 120,
      template: 140, // only for vue/max-len
      tabWidth: 2,
      ignorePattern: 'd="([\\s\\S]*?)"', // for svg
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,

      // ignoreHTMLAttributeValues: true,
      // ignoreHTMLTextContents: false,
    }],

    // [Overwrites Airbnb because they disabled ForInStatement and ForOfStatement]
    // Disallow specified syntax; Overwrites Airbnb
    // https://eslint.vuejs.org/rules/no-restricted-syntax
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
    // https://eslint.org/docs/rules/no-restricted-syntax
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'vue/no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],

    // [Overwrites Airbnb]
    // Enforce consistent spacing inside braces
    // https://eslint.vuejs.org/rules/object-curly-spacing
    // https://eslint.org/docs/rules/object-curly-spacing
    'object-curly-spacing': ['error', 'never'],
    'vue/object-curly-spacing': ['error', 'always'],

    // [Overwrites Airbnb for properties of photoshop objects]
    // Disallow dangling underscores in identifiers
    // https://eslint.org/docs/latest/rules/no-underscore-dangle
    'no-underscore-dangle': ['error', {allow: ['_value', '_id', '_obj']}],

    // [Overwrites Airbnb to disable minProperties]
    // Enforce consistent line breaks inside braces
    // https://eslint.vuejs.org/rules/object-curly-newline
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
    // https://eslint.org/docs/rules/object-curly-newline
    'object-curly-newline': ['error', {
      ObjectExpression: {multiline: true, consistent: true},
      ObjectPattern: {multiline: true, consistent: true},
      ImportDeclaration: {multiline: true, consistent: true},
      ExportDeclaration: {multiline: true, consistent: true},
    }],
    'vue/object-curly-newline': ['error', {
      ObjectExpression: {multiline: true, consistent: true},
      ObjectPattern: {multiline: true, consistent: true},
      ImportDeclaration: {multiline: true, consistent: true},
      ExportDeclaration: {multiline: true, consistent: true},
    }],

    // [Overwrites Airbnb to enforce stroustrup style]
    // Require Brace Style
    // https://eslint.vuejs.org/rules/brace-style
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
    // https://eslint.org/docs/rules/brace-style
    'brace-style': ['error', 'stroustrup', {allowSingleLine: true}],
    'vue/brace-style': ['error', 'stroustrup', {allowSingleLine: true}],

    // Disallow the use of console
    // https://eslint.org/docs/rules/no-console
    'no-console': process.env.NODE_ENV === 'production' ? ['error', {allow: ['warn', 'error']}] : 'off',

    // https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility
    'vuejs-accessibility/alt-text': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
