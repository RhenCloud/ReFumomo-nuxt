<script setup lang="ts">
// 我的历程组件
interface TimelineItem {
  date: string
  title: string
  description: string
}

const timelineItems: TimelineItem[] = [
  {
    date: '2025.08.20',
    title: '完成第一个项目',
    description: '独立开发并上线了个人主页（也就是本站）'
  },
  {
    date: '2025.06',
    title: '重新上线博客',
    description: '23年初WordPress被打之后，选择静态网站重新搭建博客。'
  },
  {
    date: '2025.05',
    title: '第一次合作',
    description: '与Hongxi合作开始开发项目，初识Vue，提升了自己的技术能力。'
  },
  {
    date: '2024.09',
    title: '进入大学',
    description: '有了更多时间学习计算机科学与技术。'
  },
  {
    date: '2022.09',
    title: '第一个博客',
    description: '使用WordPress搭建了我的第一个博客项目。'
  },
  {
    date: '2022.04.05',
    title: '注册了第二个域名',
    description: '注册了第二个域名sakura.ink。当时觉得sakura很好听，我喜欢。'
  },
  {
    date: '2020.07',
    title: '接触到了前端三件套',
    description: '学习了HTML、CSS和JavaScript，开始接触前端开发。'
  }
]
</script>

<template>
  <aside class="w-full md:w-1/2 bg-white rounded-3xl shadow-lg p-8 mb-12 timeline-section flex flex-col min-w-[280px]"
         style="box-shadow: 0 4px 24px rgba(139,90,140,0.08);">
    <h2 class="text-2xl font-bold text-primary mb-6">我的历程</h2>
    <ul class="timeline list-none p-0 m-0 space-y-6 max-h-96 overflow-y-auto pr-2"
        style="scrollbar-width: thin;">
      <li v-for="(item, index) in timelineItems" :key="index">
        <div class="flex items-start gap-4">
          <div class="flex flex-col items-center">
            <div class="w-3 h-3 rounded-full bg-primary mb-1"></div>
            <div v-if="index < timelineItems.length - 1" class="h-full w-0.5 bg-gray-200 flex-1"></div>
          </div>
          <div>
            <div class="text-sm text-gray-400">{{ item.date }}</div>
            <div class="font-semibold text-lg">{{ item.title }}</div>
            <div class="text-gray-600 text-base">{{ item.description }}</div>
          </div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
/* 自定义滚动条样式 */
.timeline::-webkit-scrollbar {
  width: 4px;
}

.timeline::-webkit-scrollbar-track {
  background: rgba(139, 90, 140, 0.05);
  border-radius: 2px;
}

.timeline::-webkit-scrollbar-thumb {
  background: rgba(139, 90, 140, 0.3);
  border-radius: 2px;
}

.timeline::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 90, 140, 0.5);
}
</style>
