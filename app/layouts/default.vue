<script setup lang="ts">
import { siteConfig } from "../config";

interface Props {
    title?: string;
    description?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: siteConfig.site.title,
    description: siteConfig.site.description,
});

// 构建完整的页面标题
const fullTitle = computed(() =>
    props.title === siteConfig.site.title ? props.title : `${siteConfig.site.title}-${props.title}`
);

// 设置页面元数据
useHead({
    title: fullTitle,
    meta: [
        { name: "description", content: props.description },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        // Open Graph / Facebook
        { property: "og:type", content: "website" },
        { property: "og:url", content: siteConfig.site.url },
        { property: "og:title", content: fullTitle },
        { property: "og:description", content: props.description },
        // Twitter
        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: siteConfig.site.url },
        { property: "twitter:title", content: fullTitle },
        { property: "twitter:description", content: props.description },
    ],
    link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" },
    ],
    script: [
        {
            defer: true,
            src: "https://cloud.umami.is/script.js",
            "data-website-id": "ac5e0626-4863-41ec-8a66-98ba076846a0",
        },
    ],
});
</script>

<template>
    <div>
        <!-- 自定义光标 -->
        <!-- <ClientOnly>
            <div ref="customCursor" class="custom-cursor"></div>
            <div ref="customCursorFollower" class="custom-cursor-follower"></div>
        </ClientOnly> -->

        <!-- 页面内容 -->
        <div class="min-h-screen bg-gray-50 font-fumofumo overflow-x-hidden">
            <slot />
        </div>
    </div>
</template>

<style>
/* 自定义光标样式已在global.css中定义 */
</style>
