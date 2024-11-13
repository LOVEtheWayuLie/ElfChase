module.exports = {
  extends: ['standard', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['import', '@typescript-eslint', 'prettier'],
  rules: {
    /** 允许封号结尾 */
    semi: 0,
    'func-names': 0, // 允许匿名function定义
    'no-unused-vars': 0, // 允许变量未使用
    /** 允许return void */
    'no-useless-return': 0,
    '@typescript-eslint/no-unused-expressions': 0, // 允许未使用的表达式
    'import/no-duplicates': ['error', { considerQueryString: true }], // 合并重复导入,支持flow type
    'no-console': ['warn', { allow: ['error', 'warn'] }], // 允许error打印
    'max-classes-per-file': 0, // 允许一个文件多个class
    '@typescript-eslint/no-invalid-this': 0, // 允许this
    'newline-after-var': 2, // 变量定义后空一行
    '@typescript-eslint/no-empty-interface': 0, // 允许空interface类型定义,方便扩展
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { disallowTypeAnnotations: false },
    ], // 强制import 必须区分import type, 同时允许types.d 文件中使用import('')语法导入
    '@typescript-eslint/no-namespace': 0, // 允许使用namespace
    '@typescript-eslint/no-shadow': 2,
    /** 注释前后至少一个空格 */
    'spaced-comment': ['warn', 'always', { block: { balanced: true } }],
  },
};
