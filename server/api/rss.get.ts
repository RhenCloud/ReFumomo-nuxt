import { XMLParser } from 'fast-xml-parser'

export interface RSSItem {
  title: string
  link: string
  pubDate: string
  description: string
  guid?: string
}

export interface RSSResponse {
  items: RSSItem[]
  total: number
  error?: string
}

export default defineEventHandler(async (event): Promise<RSSResponse> => {
  try {
    // 从环境变量中获取 RSS URL
    const config = useRuntimeConfig()
    const rssUrl = config.rssUrl
    
    if (!rssUrl) {
      console.error('RSS URL 未配置')
      return {
        items: [],
        total: 0,
        error: 'RSS URL 未配置，请在 .env 文件中设置 RSS_URL 或在 nuxt.config.ts 中配置默认值'
      }
    }
    
    console.log('正在获取 RSS:', rssUrl)
    
    // 获取 RSS 数据，设置超时和重试
    const response = await $fetch<string>(rssUrl, {
      timeout: 15000, // 15秒超时，开发环境网络可能较慢
      retry: 2, // 重试2次
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Nuxt RSS Reader; +https://haku.sakura.ink)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Cache-Control': 'no-cache' // 避免缓存问题
      }
    })

    // 解析 XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseTagValue: false,
      parseAttributeValue: false,
      trimValues: true,
      processEntities: true
    })

    const result = parser.parse(response)
    
    // 提取文章数据
    let items: RSSItem[] = []
    
    if (result.rss && result.rss.channel && result.rss.channel.item) {
      const rssItems = Array.isArray(result.rss.channel.item) 
        ? result.rss.channel.item 
        : [result.rss.channel.item]
      
      items = rssItems.map((item: any) => {
        // 清理描述内容，移除HTML标签
        let description = item.description || item['content:encoded'] || '暂无描述'
        if (typeof description === 'string') {
          description = description
            .replace(/<[^>]*>/g, '') // 移除HTML标签
            .replace(/&nbsp;/g, ' ') // 替换空格实体
            .replace(/&amp;/g, '&')  // 替换&实体
            .replace(/&lt;/g, '<')   // 替换<实体
            .replace(/&gt;/g, '>')   // 替换>实体
            .trim()
            .substring(0, 200) // 限制长度
        }
        
        return {
          title: item.title || '无标题',
          link: item.link || '#',
          pubDate: item.pubDate || new Date().toISOString(),
          description,
          guid: item.guid?.['#text'] || item.guid || item.link
        }
      })
      
      // 按日期排序，最新的在前
      items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    }

    console.log(`RSS 获取成功，共 ${items.length} 篇文章`)

    return {
      items,
      total: items.length
    }

  } catch (error) {
    console.error('RSS 获取失败:', error)
    
    // 提供更详细的错误信息
    let errorMessage = 'RSS 获取失败'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch failed')) {
        errorMessage = 'RSS 源无法访问，请检查网络连接或 RSS URL 是否正确'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'RSS 获取超时，请稍后重试'
      } else {
        errorMessage = `RSS 获取失败: ${error.message}`
      }
    }
    
    return {
      items: [],
      total: 0,
      error: errorMessage
    }
  }
})
