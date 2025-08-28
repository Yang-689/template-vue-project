import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  typescript: true,
}, {
  files: ['**/*.{js,jsx,ts,tsx,vue}'],
  rules: {
    'no-console': 'warn',
  },
})
