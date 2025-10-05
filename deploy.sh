#!/bin/bash

# Fumomo Nuxt 项目部署脚本

echo "🚀 开始部署 Fumomo Nuxt 项目到 Vercel..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "请先安装: npm i -g vercel"
    exit 1
fi

# 构建项目
echo "📦 构建项目..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功!"
    
    # 部署到 Vercel
    echo "🌐 部署到 Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 部署成功!"
        echo "📝 请记得更新配置文件中的网站URL"
    else
        echo "❌ 部署失败"
        exit 1
    fi
else
    echo "❌ 构建失败"
    exit 1
fi
