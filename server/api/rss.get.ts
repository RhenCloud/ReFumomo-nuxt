import { XMLParser } from "fast-xml-parser";

export interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    guid?: string;
}

export interface RSSResponse {
    items: RSSItem[];
    total: number;
    error?: string;
}

export default defineEventHandler(async (event): Promise<RSSResponse> => {
    try {
        // 从配置中获取 RSS URL
        const rssUrl = "https://blog.rhen.cloud/rss.xml"; //自定义文章的RSS地址

        // 获取 RSS 数据，设置超时和重试
        const response = await $fetch<string>(rssUrl, {
            timeout: 10000, // 10秒超时
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; Nuxt RSS Reader; +https://rhen.cloud)",
                Accept: "application/rss+xml, application/xml, text/xml, */*",
            },
        });

        // 解析 XML
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            textNodeName: "#text",
            parseTagValue: false,
            parseAttributeValue: false,
            trimValues: true,
            processEntities: true,
        });

        const result = parser.parse(response);

        // 提取文章数据
        let items: RSSItem[] = [];

        if (result.rss && result.rss.channel && result.rss.channel.item) {
            const rssItems = Array.isArray(result.rss.channel.item)
                ? result.rss.channel.item
                : [result.rss.channel.item];

            items = rssItems.map((item: any) => {
                // 清理描述内容，移除HTML标签
                let description = item.description || item["content:encoded"] || "暂无描述";
                if (typeof description === "string") {
                    description = description
                        .replace(/<[^>]*>/g, "") // 移除HTML标签
                        .replace(/&nbsp;/g, " ") // 替换空格实体
                        .replace(/&amp;/g, "&") // 替换&实体
                        .replace(/&lt;/g, "<") // 替换<实体
                        .replace(/&gt;/g, ">") // 替换>实体
                        .trim()
                        .substring(0, 200); // 限制长度
                }

                return {
                    title: item.title || "无标题",
                    link: item.link || "#",
                    pubDate: item.pubDate || new Date().toISOString(),
                    description,
                    guid: item.guid?.["#text"] || item.guid || item.link,
                };
            });

            // 按日期排序，最新的在前
            items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        }

        return {
            items,
            total: items.length,
        };
    } catch (error) {
        console.error("RSS 获取失败:", error);

        return {
            items: [],
            total: 0,
            error: `RSS 获取失败: ${error instanceof Error ? error.message : "未知错误"}`,
        };
    }
});
