# Kun Han Tech - Site v2

A modern, SEO-friendly static website built with [Astro](https://astro.build/).

## 🚀 Project Structure

```
kunhanl-site-v2/
├── public/
│   └── images/           # Static assets (images, icons)
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Nav.astro     # Navigation bar
│   │   ├── Footer.astro  # Site footer
│   │   └── Card.astro    # Card component
│   ├── layouts/
│   │   └── BaseLayout.astro  # Main layout wrapper
│   ├── pages/            # File-based routing
│   │   ├── index.astro   # Homepage (/)
│   │   ├── chatbot.astro # Chatbot page (/chatbot)
│   │   └── travel/       # Travel section
│   │       ├── index.astro    # /travel
│   │       ├── food.astro     # /travel/food
│   │       ├── home.astro     # /travel/home
│   │       ├── location.astro # /travel/location
│   │       └── okinawa.astro  # /travel/okinawa
│   └── styles/
│       └── global.css    # Global styles
├── astro.config.mjs      # Astro configuration
├── package.json
└── tsconfig.json
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Local Development

```bash
# Install dependencies
npm install

# Start development server (default: http://localhost:4321)
npm run dev
```

### Build for Production

```bash
# Generate static files to ./dist
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Deploy!

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Deploy!

### AWS S3 + CloudFront

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload `dist/` folder contents to your S3 bucket:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. Configure CloudFront distribution pointing to your S3 bucket

4. **Do I need SPA rewrite rules?**
   
   **No!** Since this is a Static Site Generation (SSG) project, every URL has a corresponding HTML file. No rewrite rules are needed:
   - `/` → `index.html`
   - `/chatbot` → `chatbot/index.html`
   - `/travel` → `travel/index.html`
   - `/travel/food` → `travel/food/index.html`
   
   CloudFront will serve the correct file for each route automatically.

## 📝 Adding New Pages

To add a new page, simply create a new `.astro` file in `src/pages/`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="New Page" description="Description here">
  <h1>New Page</h1>
  <p>Your content here.</p>
</BaseLayout>
```

## 📄 License

MIT License - Kun Han Tech

