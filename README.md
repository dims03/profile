# Dimas Prayogi — Portfolio

A single-screen portfolio built with React, TypeScript, Vite, and Tailwind CSS.

## Development

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. To check and build the production site:

```sh
npm run build
npm run preview
```

The production files are generated in `build/`, which is excluded from Git. For Laragon or another static host, publish the contents of `build/`. The source `index.html` needs Vite and cannot be deployed directly.

## Project structure

```text
.github/workflows/deploy.yml  GitHub Pages deployment
public/favicon.png           Static favicon
src/
  assets/
    cartoon.webp             Full-resolution transparent hero portrait
    cartoon-640.webp         Smaller responsive hero portrait
    cartoon-xray.webp        Hover-only anatomical illustration
    cartoon.png              Original source (not loaded by the website)
    resume.pdf               Downloadable resume
    projects/                Project screenshots (WebP)
    tech/                    Technology icons (PNG/SVG)
  data/
    projects.json            Project titles, descriptions, and image filenames
    tech-stack.json          Technology names and icon filenames
    work-history.ts          Companies, roles, dates, and responsibilities
  components/
    ProjectShowcase.tsx      Featured projects and the remaining project archive
    ContactPanel.tsx         Email, copy action, LinkedIn, and resume
    PortraitScanner.tsx      Pointer-following X-ray reveal
  styles/main.css            Layout, responsive styles, and animations
  App.tsx                    Portfolio layout and interactive panels
  main.tsx                   React entry point
index.html                   Vite HTML entry point
```

## Editing content

- Edit `src/data/projects.json` for projects. Place screenshots in `src/assets/projects/` and use the filename in the `image` field.
- Featured projects have a numeric `featuredOrder`, plus `category`, `role`, `stack`, and `highlights`. The three selected projects show the confirmed Lead Developer role. Other projects remain in the expandable list.
- Edit `src/data/tech-stack.json` for technologies. Place icons in `src/assets/tech/` and use the filename in the `image` field.
- Edit `src/data/work-history.ts` for experience.
- Edit `src/App.tsx` for profile text, navigation, and social links.
- The hero's View Projects and Let's talk links open the corresponding panels. Message opens the contact panel, where visitors can copy the email address, open email or LinkedIn, or view the resume.
- Edit `src/styles/main.css` for styling. The cartoon keeps its original colors and transparency. The hero uses responsive WebP files (640px and 1024px wide); the original PNG is retained as a source and is not included in the production build.
- On screens at least 640px wide with a mouse, hovering over the cartoon reveals a circular X-ray illustration. The additional 224 KiB WebP is requested only on the first hover over the visible character. Touch/mobile visitors keep the normal portrait without this extra download. Reduced-motion preferences disable the reveal transition. Asset provenance and the generation prompt are in [docs/portrait-xray.md](docs/portrait-xray.md).
- Typography uses Space Grotesk for names/headings and Manrope for body text, loaded from Google Fonts with `display=swap`. Mobile uses an asymmetric editorial layout: stacked name, portrait on the right, core stack, warm accent, and a featured-project link above the footer metadata. The scrolling name remains on larger screens.

## GitHub Pages

1. In `dims03/profile`, open **Settings → Pages** and choose **GitHub Actions** under **Build and deployment → Source**.
2. Commit and push the source changes to `main`.
3. Wait for **Deploy portfolio to GitHub Pages** in the **Actions** tab to finish, then open `https://dims03.github.io/profile/`.

The workflow installs dependencies, runs the build, and publishes only `build/`. It selects the asset base path using GitHub Pages metadata, supporting both `/profile/` and a custom domain. If Pages was enabled after the push, start the workflow using **Run workflow**.

A 404 for `/src/main.tsx` means the source HTML was published. Switch the Pages source to **GitHub Actions** and deploy the workflow; do not publish the repository root with **Deploy from a branch**.
