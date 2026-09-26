# Nithara Homes

A responsive React website for a residential builder, with villa imagery and an interior gallery. The app uses React 19, TypeScript, and the Vinext/Vite toolchain.

## Development

Use Node.js 22.13 or newer.

```sh
npm install
npm run dev
```

Open the URL printed by the development server.

```sh
npm run build
```

## GitHub Pages

The repository deploys automatically to GitHub Pages on pushes to `main`. The
workflow exports the site to `out/` and configures the repository-name base path
for project pages. In the repository settings, set **Pages** to **GitHub Actions**.

For a local Pages build, set both `NEXT_BASE_PATH` and `NEXT_PUBLIC_BASE_PATH` to
`/<repository-name>` and run `npm run build:pages`.

## Content

- `app/page.tsx`: homepage, navigation, project imagery, and gallery content.
- `app/globals.css`: responsive styling, colors, typography, and motion.
- `app/layout.tsx`: page title, description, and favicon metadata.
- `public/images/`: optimized JPEG copies of the supplied assets. Originals remain untouched in the parent folder.

The residence names are descriptive labels for the supplied renders, not verified commercial project names. Location, pricing, availability, dimensions, approvals, and contact information have intentionally not been fabricated. Add verified details before a public launch. No contact form or lead collection service is configured.

The `.openai/hosting.json` file contains the registered Sites project ID. Publication has not yet completed.
