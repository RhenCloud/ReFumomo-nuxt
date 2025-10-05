<script setup lang="ts">
// 个人履历组件

interface Skill {
    category: string;
    technologies: { name: string; color: string }[];
}

interface Project {
    title: string;
    description: string;
    technologies: { name: string; color: string }[];
    bgColor: string;
    borderColor: string;
}

const skills: Skill[] = [
    {
        category: "前端开发",
        technologies: [
            { name: "HTML", color: "bg-orange-100 text-orange-800" },
            { name: "JavaScript", color: "bg-blue-100 text-blue-800" },
        ],
    },
    {
        category: "后端开发",
        technologies: [
            { name: "Python", color: "bg-purple-100 text-purple-800" },
            { name: "C++", color: "bg-green-100 text-green-800" },
            { name: "Java", color: "bg-red-100 text-red-800" },
        ],
    },
    {
        category: "数据库",
        technologies: [
            { name: "MySQL", color: "bg-gray-100 text-gray-800" },
            { name: "Redis", color: "bg-red-100 text-red-800" },
        ],
    },
];

const projects: Project[] = [
    {
        title: "ILP",
        description: "跨平台、多网站、模块化的小说下载器",
        technologies: [{ name: "Python", color: "bg-blue-100 text-blue-800" }],
        bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
        borderColor: "border-blue-100",
    },
    {
        title: "ILP-C++",
        description: "跨平台、多网站、模块化的小说下载器",
        technologies: [{ name: "C++", color: "bg-purple-100 text-purple-800" }],
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        borderColor: "border-green-100",
    },
];
</script>

<template>
    <section
        class="bg-white rounded-3xl shadow-lg p-8 w-full mb-12"
        style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
    >
        <h2 class="text-3xl font-bold text-primary mb-8 text-center font-fumofumo">个人履历</h2>

        <!-- 技术栈 -->
        <div class="space-y-6">
            <h3 class="text-xl font-semibold text-primary mb-4 flex items-center">
                <i class="fas fa-code mr-2"></i>
                我使用的技术栈
            </h3>
            <div class="flex justify-center mb-4">
                <!-- 添加这一行 -->
                <img src="/icons.svg" alt="技能图标" class="rounded-lg" style="max-width: 100%" />
            </div>
        </div>

        <!-- 技能专长 -->
        <div class="space-y-6">
            <!-- <div class="mt-8"> -->
            <h3 class="text-xl font-semibold text-primary mb-4 flex items-center">
                <i class="fas fa-code mr-2"></i>
                技能专长
            </h3>
            <div class="space-y-3">
                <div
                    v-for="skill in skills"
                    :key="skill.category"
                    class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                    <span class="text-gray-700">{{ skill.category }}</span>
                    <div class="flex gap-1">
                        <span
                            v-for="tech in skill.technologies"
                            :key="tech.name"
                            :class="`px-2 py-1 text-xs rounded ${tech.color}`"
                        >
                            {{ tech.name }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 项目经历 -->
        <div class="mt-8">
            <h3 class="text-xl font-semibold text-primary mb-6 flex items-center">
                <i class="fas fa-rocket mr-2"></i>
                主要项目
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    v-for="project in projects"
                    :key="project.title"
                    :class="`${project.bgColor} rounded-lg p-4 border ${project.borderColor}`"
                >
                    <h4 class="font-semibold text-gray-800 mb-2">{{ project.title }}</h4>
                    <p class="text-gray-600 text-sm mb-3">{{ project.description }}</p>
                    <div class="flex gap-2 flex-wrap">
                        <span
                            v-for="tech in project.technologies"
                            :key="tech.name"
                            :class="`px-2 py-1 text-xs rounded ${tech.color}`"
                        >
                            {{ tech.name }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* 组件特定样式 */
</style>
