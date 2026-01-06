# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Abid Aboobaker (ekuttan.github.io), built with Astro and Tailwind CSS. It's a single-page application showcasing professional experience, background, and contact information.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server at localhost:4321
npm run dev

# Type check the project
astro check

# Build for production (runs type checking first)
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro [command]
```

## Architecture

### Framework & Styling
- **Astro 3.4.3**: Static site generator with component-based architecture
- **Tailwind CSS**: Utility-first CSS framework with custom theme
- **TypeScript**: Strict type checking enabled via `astro/tsconfigs/strict`

### Project Structure
- `src/pages/`: File-based routing (index.astro is the main page)
- `src/layouts/`: Reusable layout components (Layout.astro)
- `public/`: Static assets (images, favicon)

### Key Configuration

**Site Configuration** (astro.config.mjs):
- Site URL: `https://ekuttan.github.io`
- Base path: `/`
- Integrations: Tailwind CSS

**Custom Tailwind Theme** (tailwind.config.mjs):
- Custom colors: `primary` (#FFE653), `secondary` (#74E7D2), `background` (#EEEBE7)
- Font: DM Sans (variable font)
- Custom animations: `tinkerer`, `tinkererMin`, `human`, `coding`, `design`, `fadeIn`, `fadeInLeft`
- Plugin: `tailwind-scrollbar-hide`

### Design Patterns

**Responsive Design**:
- Mobile-first approach with `sm:` breakpoint prefixes
- Different layouts for mobile (stacked) and desktop (side-by-side)
- Custom animations adjust for mobile vs desktop (e.g., `animate-tinkerer` vs `animate-tinkererMin`)

**SEO & Metadata**:
- Canonical URL using Astro.url.pathname
- Complete Open Graph and Twitter Card meta tags
- Schema.org microdata for Person type
- All configured in Layout.astro

**Interactive Elements**:
- Client-side clipboard copying functionality in `<script>` tag
- Email copy button with temporary success feedback
- Hover states with animation transitions
- Profile picture reveal on logo hover

### Styling Approach

The site uses extensive Tailwind utility classes with:
- Responsive breakpoints: `sm:`, `xl:`, `2xl:`
- Custom spacing: container max-width of 1440px with auto margins
- Overflow handling: `scrollbar-hide` on scrollable content
- Custom keyframe animations defined in Tailwind config

### Content Management

Main content is in `src/pages/index.astro`:
- Bio section with animated emoji accents
- Company links with SVG underlines (hidden on mobile)
- Structured data using itemscope/itemprop attributes
- Contact email: ab@hoomans.dev (hardcoded in copy button script)

## Development Notes

- The site is deployed to GitHub Pages (ekuttan.github.io)
- Production URL differs from configured site URL (ekuttan.in) - canonical URL uses ekuttan.in
- Custom animations are defined using Tailwind's keyframes system, not CSS files
- Uses both @fontsource-variable package and Google Fonts CDN for DM Sans font
