# Apricity GitBook

**Apricity #YourLove** — Technical documentation site for the Apricity e-commerce platform.

A self-contained, static GitBook-style documentation covering both the [Frontend](https://github.com/your-org/Apricity-FrontEnd) (React + Vite) and [Backend](https://github.com/your-org/Apricity-BackEnd) (Express) repositories.

## Preview

Open `index.html` directly in any browser — no build step or dependencies required:

```bash
open index.html
```

Or serve with any static file server:

```bash
npx serve .
```

## Documentation Sections

### Getting Started

| Page | Description |
| ---- | ----------- |
| Introduction | Project overview, features, and quick links |
| Architecture | System diagram, routing strategy, data flow, repository structure |
| Quick Start | Step-by-step local setup for both frontend and backend |
| Shop Operator Guide | Pancake product/category setup rules that match the storefront mapping |

### Backend — API Reference

| Page | Description |
| ---- | ----------- |
| Overview | Tech stack, project structure, route mounting, CORS |
| Products API | Frontend products, admin CRUD, legacy endpoints, inventory check |
| Orders API | Order creation (frontend + admin), query parameters |
| Payments API | SePay QR bank-transfer flow, IPN webhooks, status polling |
| Address API | Province / district / commune lookup for checkout |
| Services & Jobs | Email service, inventory validation, SePay store, background tasks |
| Environment Vars | Complete reference for all backend configuration variables |

### Frontend

| Page | Description |
| ---- | ----------- |
| Overview | Tech stack, features, project structure |
| Pages & Routes | Route table, lazy loading, layout components |
| Checkout & Shipment Flow | Pancake address lookup, live GHTK fee quote, order submission paths |
| Components | Layout, UI, and section-level component reference |
| State & Logic | API client, cart store, inventory module, error handling |
| Internationalization | i18next setup, translation key structure, adding new translations |

### Deployment

| Page | Description |
| ---- | ----------- |
| Docker & Compose | Individual container builds, full-stack Docker Compose |
| Cloudflare Tunnel | Domain setup, tunnel creation, ingress config, common issues |

## Features

- 🌗 **Dark / Light theme** — toggle with localStorage persistence
- 🔍 **Real-time search** — filter sidebar navigation instantly
- 📱 **Responsive** — mobile layout with hamburger sidebar
- 📋 **Copy code** — one-click copy on all code blocks
- ⬅️➡️ **Prev / Next navigation** — sequential page browsing
- 🔗 **Cross-linking** — in-page links between documentation pages
- ✨ **Smooth transitions** — fade-in page animations

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| HTML | Page structure |
| CSS (vanilla) | Styling with CSS custom properties for theming |
| JavaScript (vanilla) | SPA routing, search, theme toggle |
| Google Fonts | Inter (body) + JetBrains Mono (code) |

## Deploy to GitHub Pages

This repo is ready to deploy as a GitHub Pages site with a custom domain.

### 1. Enable GitHub Pages

Go to **Settings → Pages** in your GitHub repo and set:

- **Source**: `Deploy from a branch`
- **Branch**: `main` (root `/`)

### 2. Add CNAME record on Cloudflare

In your Cloudflare dashboard for `apricity.com.vn`, add:

| Type | Name | Target |
| ---- | ---- | ------ |
| CNAME | `docs` | `<your-github-username>.github.io` |

> Make sure the proxy status is **DNS only** (grey cloud) — GitHub Pages handles its own TLS.

### 3. Verify

After DNS propagates (usually a few minutes), your docs will be live at:

```
https://docs.apricity.com.vn
```

GitHub will also auto-provision a free TLS certificate for the custom domain.

## File Structure

```
Apricity-GitBook/
├── index.html      # Main HTML shell (sidebar, nav, script tags)
├── styles.css      # Design system with dark/light theme tokens
├── pages.js        # All 18 documentation pages as content objects
├── app.js          # SPA router, search, theme toggle, mobile sidebar
├── CNAME           # Custom domain for GitHub Pages
├── LICENSE
└── README.md
```

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
