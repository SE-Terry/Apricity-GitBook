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

## File Structure

```
Apricity-GitBook/
├── index.html      # Main HTML shell (sidebar, nav, script tags)
├── styles.css      # Design system with dark/light theme tokens
├── pages.js        # All 17 documentation pages as content objects
├── app.js          # SPA router, search, theme toggle, mobile sidebar
├── LICENSE
└── README.md
```

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
