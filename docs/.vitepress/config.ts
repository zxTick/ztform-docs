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
    }
  }
})
