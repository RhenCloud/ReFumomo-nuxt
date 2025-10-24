<script setup lang="ts">
import { siteConfig } from '../config'
import { useUmamiStats } from '../composables/useUmamiStats'
// 我没删除，你们也可以拿来调试umami
// 直接调用以查看返回值
const stats = await useUmamiStats()

console.log('=== Umami 调试信息 ===')
console.log('配置:', siteConfig.umami)
console.log('返回的数据:', stats)
console.log('访客数:', stats.visitors)
console.log('类型检查:', typeof stats, typeof stats.visitors)

// 测试 API 调用
const testApiCall = async () => {
  try {
    const endAt = Date.now()
    const startAt = new Date('2020-01-01').getTime()
    const url = `${siteConfig.umami.apiEndpoint}/v1/websites/${siteConfig.umami.websiteId}/stats?startAt=${startAt}&endAt=${endAt}`
    
    console.log('测试 API URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'x-umami-api-key': siteConfig.umami.apiKey
      }
    })
    
    console.log('响应状态:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API 错误响应:', errorText)
    } else {
      const data = await response.json()
      console.log('API 成功响应:', data)
    }
  } catch (error) {
    console.error('API 调用失败:', error)
  }
}

// 在客户端执行测试
if (process.client) {
  testApiCall()
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Umami 统计调试</h1>
    
    <div class="bg-gray-100 p-4 rounded mb-4">
      <h2 class="font-bold">配置信息：</h2>
      <pre class="text-sm">{{ JSON.stringify(siteConfig.umami, null, 2) }}</pre>
    </div>
    
    <div class="bg-gray-100 p-4 rounded mb-4">
      <h2 class="font-bold">返回的数据：</h2>
      <pre class="text-sm">{{ JSON.stringify(stats, null, 2) }}</pre>
    </div>
    
    <div class="bg-gray-100 p-4 rounded">
      <h2 class="font-bold">访客数显示测试：</h2>
      <p>直接访问: {{ stats.visitors }}</p>
      <p>条件显示: {{ stats?.visitors ? "已有" + stats.visitors + "人发现了我" : "统计未启用" }}</p>
      <p>启用状态: {{ siteConfig.umami.enable ? '已启用' : '未启用' }}</p>
      <p class="mt-4 text-sm text-gray-600">请查看浏览器控制台获取详细的 API 调用信息</p>
    </div>
  </div>
</template>
