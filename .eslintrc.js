module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended'],

    // add your custom rules here
    //it is base on https://github.com/vuejs/eslint-config-vue
    rules: {
        "vue/max-attributes-per-line": [2, {
            "singleline": 10,
            "multiline": {
                "max": 1,
                "allowFirstLine": false
            }
        }],
        'vue/html-closing-bracket-newline': 0,
        "vue/singleline-html-element-content-newline": 0,
        "vue/multiline-html-element-content-newline": 0,
        "vue/name-property-casing": ["error", "PascalCase"],
        "vue/no-v-html": 0,
        "vue/attibute-hyphenation": 0,
        "vue/attributes-order": 0,
        "vue/html-closing-bracket-spacing": 0,
        "vue/require-default-prop": 0,
        'vue/no-unused-vars': 0,
        // allow async-await
        'generator-star-spacing': 'off',
        'import/first': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
        'no-undef': 'off',
        'prefer-promise-reject-errors': 1,
        'no-eval': 2,
        'no-unused-vars': 1,
        'no-useless-escape': 0,
        'vue/no-parsing-error': [2, { "x-invalid-end-tag": false }],
        'vue/order-in-components': 0,
        'vue/html-self-closing': 0,
        'vue/attribute-hyphenation': 0
    }
}
