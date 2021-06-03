module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',  // Allows for the use of imports
    },
    rules: {
        'eol-last': 1,
        'max-statements-per-line': 1,
        'no-multiple-empty-lines': [
            'error', {
                'maxBOF': 0,
                // This is weird, it might be because of the previous rule 'eol-last'
                // maxEOF: 1 looks for two spaces at the end
                'maxEOF': 0,
                'max': 99
            }
        ],
        'no-console': 'warn',
        'semi': 1,
        'quotes': [
            1, 'single', 'avoid-escape'
        ]
    },
};
