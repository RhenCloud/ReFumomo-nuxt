// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 配置CSS
  css: [
    '@/assets/styles/global.css'
  ],
  
  // 配置modules
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // 运行时配置
  runtimeConfig: {
    // 服务端私有配置
    rssUrl: process.env.RSS_URL || 'https://blog.sakura.ink/rss.xml',
    
    // 公开的运行时配置
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://haku.sakura.ink'
    }
  },

  // 构建配置，为生产环境优化
  build: {
    transpile: process.env.NODE_ENV === 'production' ? ['fast-xml-parser'] : []
  }
})
