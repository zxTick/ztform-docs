import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ZTForm',
  description: 'a framework to help you create your own canvas application',
  lastUpdated: true,
  markdown: {
    theme: 'material-palenight',
    lineNumbers: true
  },
  themeConfig: {
    logo: '/logo.png',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Tick Wu and Alex Zhang'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zxTick/zt-form-docs' }
    ],
    editLink: {
      pattern: 'https://github.com/zxTick/zt-form-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: '快速入门', link: '../guide/getting-started.md' },
          { text: '配置说明', link: '../guide/configuration-notes.md' },
          { text: '获取参数', link: '../guide/generator-params.md' },
          { text: '表单重制', link: '../guide/reset.md' },
          { text: '表单更新', link: '../guide/update.md' },
          { text: '表单校验模式一', link: '../guide/validator-one.md' },
          { text: '表单校验模式二', link: '../guide/validator-two.md' },
          { text: '监听模式', link: '../guide/watch.md' },
        ]
      }
    ]
  }
})
