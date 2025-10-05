# Haku Fumomo - Personal Homepage

A modern personal homepage built with Nuxt 4 + Vue 3 + Tailwind CSS, with support for subscribing to articles via RSS.

## Features

- Modern design with responsive layout
- Mobile-friendly
- RSS article subscription functionality
- Excellent performance based on Nuxt 4
- TypeScript support
- Tailwind CSS for styling

## Tech Stack

- **Frontend Framework**: Nuxt 4 + Vue 3
- **Styling**: Tailwind CSS v3
- **Typing**: TypeScript
- **Deployment**: Vercel
- **RSS Parsing**: fast-xml-parser

## Installation and Usage

### Local Development

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Visit http://localhost:3000
```

### Production Build

```bash
# Build the project
pnpm build

# Preview the build
pnpm preview
```

## Deployment to Vercel

### Automatic Deployment (Recommended)

1. Push your code to a GitHub repository
2. Import your GitHub repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect the Nuxt project and deploy it
4. You will get a `.vercel.app` domain after deployment

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```



### Personal Information

Modify your personal information in `app/config/index.ts`:

```typescript
personal: {
  name: "Your Name",
  nickname: "Nickname",
  bio: "Personal bio",
  avatar: "Avatar URL",
  social: {
    github: "https://github.com/your-username",
    email: "your-email@example.com"
  }
}
```

## Project Structure

```
fumomo-nuxt/
├── app/
│   ├── assets/
│   │   └── styles/          # Global styles
│   ├── components/          # Vue components
│   ├── config/
│   │   └── index.ts         # Site configuration
│   ├── layouts/
│   │   └── default.vue      # Default layout
│   └── pages/               # Page routes
├── server/
│   └── api/
│       └── rss.get.ts       # RSS API route
├── public/                  # Static assets
├── nuxt.config.ts           # Nuxt configuration
└── package.json
```

## Customization

### Theme Colors

Modify the `theme` section in `app/config/index.ts`:

```typescript
theme: {
  primaryColor: "#8b5a8c",
  secondaryColor: "#f0f9ff",
  accentColor: "#ffeef8",
  textColor: "#666",
  fontFamily: "'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif"
}
```

### Navigation Menu

Modify the `navigation` section in `app/config/index.ts`:

```typescript
navigation: [
  { name: "Home", href: "/", key: "home"},
  { name: "Articles", href: "/articles", key: "articles"},
  { name: "About", href: "/about", key: "about"},
  // Add more navigation items...
]
```

## RSS Functionality

The project supports fetching RSS data from an external blog and displaying it on the articles page:

1. **RSS Data Fetching**: Fetched via the `/api/rss` endpoint
2. **XML Parsing**: Uses `fast-xml-parser` to parse RSS XML
3. **Automatic Pagination**: Supports paginated article lists
4. **Error Handling**: Displays a friendly error message on network failure
5. **Cache Optimization**: Vercel automatically caches API responses

## Vercel Deployment Optimization

The project is optimized for Vercel deployment:

- Uses the `vercel-edge` preset for better performance
- Pre-renders the homepage for better SEO
- Automatically caches static assets
- Supports Serverless Functions

## License

MIT License

## Contributing

Issues and Pull Requests are welcome!

---

If this project helps you, please give it a Star!
