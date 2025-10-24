// ========================================
//  Fumomo 网站配置文件
// ========================================
//
// 这个文件包含了网站的所有配置信息。你可以通过修改这些值来：
// 更改网站标题和描述
// 设置文章RSS订阅地址（请前往.env文件中修改）
// 自定义首页内容和介绍
// 修改个人信息和社交链接
// 调整主题色彩和样式
//
// 修改后保存文件，网站会自动更新！
// ========================================

// 网站配置文件 - 集中管理所有网站设置
export const siteConfig = {
    // ========================================
    // 🌟 核心网站设置 - 最重要的配置
    // ========================================
    site: {
        // 网站标题 - 显示在浏览器标签页和导航栏
        title: "Haku Fumomo-Nuxt",

        // 网站副标题 - 显示在首页标题下方
        subtitle: "你好，欢迎来到Haku的个人主页Fumomo！",

        // 网站描述 - 用于SEO和社交媒体分享
        description: "欢迎来到Haku Fumomo的温柔世界，在这里分享技术、生活和思考",

        // 网站URL - 完整的域名地址
        url: "https://haku.sakura.ink",
    },

    // ========================================
    // 文章设置 - 配置文章来源
    // ！！！如果要设置文章RSS订阅地址（请前往.env文件中修改）
    // ========================================
    articles: {
        // 文章页面标题
        pageTitle: "我的文章",

        // 文章页面描述
        pageDescription: "技术分享与生活感悟",

        // 每页显示文章数量
        postsPerPage: 10,

        // 文章来源说明
        sourceDescription: "文章内容来自我的博客",
    },

    // ========================================
    // 首页内容设置 - 自定义首页展示
    // ========================================
    home: {
        // 主标题（通常使用site.title）
        mainTitle: "Fumomo",

        // 欢迎语句
        welcomeText: "一个充满温暖与创意的小窝",

        // 首页特色介绍卡片 - 可以自由修改图标、标题和描述
        features: [
            {
                title: "技术分享",
                description: "分享编程技巧、框架使用心得和技术思考",
            },
            {
                title: "生活记录",
                description: "记录日常生活中的美好瞬间和感悟",
            },
            {
                title: "创意项目",
                description: "展示个人项目和创意作品",
            },
        ],
    },

    // ========================================
    // 页面配置
    // ========================================
    pages: {
        home: {
            title: "首页",
        },
        articles: {
            title: "我的文章",
            description: "技术分享与生活感悟",
        },
        about: {
            title: "关于",
        },
        projects: {
            title: "项目作品",
            description: "我的一些项目作品",
        },
        friends: {
            title: "友链",
            description: "欢迎加入我的友链交流",
        },
        website: {
            title: "我的网站",
            description: "正在运行的网站信息",
        },
    },

    // ========================================
    // 个人信息设置
    // ========================================
    personal: {
        // 基本信息
        name: "Haku",
        bio: "平时喜欢整点新奇玩意，喜欢做点小项目。",
        hobby: "编程开发、网页设计",
        location: "广东深圳",
        learning: "Astro、VUE、C#",
        avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2731443459&spec=5",

        // 关于页面社交媒体链接
        social: {
            github: "https://github.com/Hakutyan-bai",
            email: "lzj159035@foxmail.com",
        },
        blog: {
            url: "https://blog.sakura.ink",
        },
    },

    // ========================================
    // 个人履历组件显示开关
    // ========================================
    qualificationSections: {
        githubHeatmap: true,      // GitHub 热力图
        skills: true,             // 技能专长
        education: true,          // 教育背景
        workExperience: true,     // 工作经历
        projects: true,           // 项目经历
        awards: true,             // 获得荣誉
    },

    // ========================================
    // 网站UI设置
    // ========================================

    // 导航菜单
    navigation: [
        { name: "首页", href: "/", key: "home" },
        { name: "文章", href: "/articles", key: "articles" },
        { name: "关于", href: "/about", key: "about" },
        { name: "友链", href: "/friends", key: "friends" },
        { name: "项目", href: "/projects", key: "projects" },
        { name: "网站", href: "/website", key: "website" },
    ],

    // 主题配置
    theme: {
        primaryColor: "#8b5a8c",
        secondaryColor: "#f0f9ff",
        accentColor: "#ffeef8",
        textColor: "#666",
        fontFamily: "'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif",
        
        // 自定义鼠标样式开关
        // 设置为 true 启用自定义鼠标样式（小圆点 + 跟随效果）
        // 设置为 false 使用系统默认鼠标样式
        // 注意：自定义鼠标样式仅在桌面端（非触摸设备）生效
        customCursor: true,
    },

    // ========================================
    // Umami统计配置 - 记得在layout插入Umami的脚本
    // ========================================
    umami: {
        enable: true, // 是否显示umami统计
        apiKey: "api_NqmrT65HsrwXosO7VqPCXXQPvWr6DclQ", // Umami Cloud V3 API 密钥，从 https://cloud.umami.is 获取
        websiteId: "ac5e0626-4863-41ec-8a66-98ba076846a0", // 网站ID，从 Umami Cloud 获取
        apiEndpoint: "https://api.umami.is", // Umami Cloud API 地址
    },
};

// ========================================
// 类型定义和辅助函数
// ========================================

// 页面类型定义
export type PageKey = keyof typeof siteConfig.pages;

// 获取页面配置的辅助函数
export function getPageConfig(pageKey: PageKey) {
    return siteConfig.pages[pageKey];
}

// 获取页面标题的辅助函数
export function getPageTitle(pageKey: PageKey) {
    return siteConfig.pages[pageKey].title;
}

// 获取社交媒体链接的辅助函数
export function getSocialLinks() {
    return Object.entries(siteConfig.personal.social).map(([platform, url]) => ({
        platform,
        url,
        name: platform.charAt(0).toUpperCase() + platform.slice(1),
    }));
}

// 获取网站完整标题的辅助函数
export function getFullTitle(pageTitle?: string) {
    return pageTitle ? `${pageTitle} - ${siteConfig.site.title}` : siteConfig.site.title;
}
