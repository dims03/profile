# Dimas Prayogi — Portfolio

Single-screen editorial portfolio, built with React, TypeScript, Vite, and Tailwind CSS. All photographs, project screenshots, and the résumé are the existing local assets.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` checks TypeScript and creates the production site in `build/`. `npm run preview` previews that build. Deploy the contents of `build/` to your web root, including for Laragon; the source `index.html` requires the Vite dev server.

Story, Tech Stack, Experience, and Project open keyboard-accessible panels on desktop and mobile. Tech Stack retains the 24 original tools, and Experience retains the original companies, roles, and dates. Project retains all 15 existing projects; click a project to see its screenshot and description. Message opens email, and social links use the original profile URLs.

The hero uses a charcoal studio background with subtle procedural grain and the existing transparent cartoon portrait (`img/cartoon.png`, 1024 × 1536), displayed in black and white. The visible silhouette is centered using its opaque bounds, with separate sizing for desktop and mobile. Mobile reserves space above the footer and softly fades the portrait's bottom edge. The name track includes bottom padding so the webfont's descenders remain visible.

Main layout and content: `src/App.tsx`. Styling and animation: `src/style.css`. Projects: `src/projects.json`.
