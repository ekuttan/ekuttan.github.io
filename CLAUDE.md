# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Abid Aboobaker (ekuttan.github.io), built with Astro 5 and Tailwind CSS. Deployed to GitHub Pages with canonical URL at ekuttan.in.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Type check + production build
npm run preview      # Preview production build
astro check          # Type check only
```

## Architecture

**Stack**: Astro 5, Tailwind CSS 3, TypeScript (strict mode)

**Pages**:
- `src/pages/index.astro` - Main portfolio page with bio, company links, contact

**Layout**: `src/layouts/Layout.astro` - Shared HTML shell with SEO meta tags (OG, Twitter Cards), canonical URL handling, and DM Sans font loading

**Key Tailwind Config** (`tailwind.config.mjs`):
- Colors: `primary` (#FFE653 yellow), `secondary` (#74E7D2 teal), `background` (#EEEBE7 beige)
- Custom animations: `tinkerer`, `tinkererMin`, `human`, `coding`, `design`, `fadeIn`, `fadeInLeft`
- Plugin: `tailwind-scrollbar-hide`

**Responsive Pattern**: Mobile-first with `sm:` breakpoint. Mobile uses white background, desktop uses beige. Some animations have mobile variants (e.g., `animate-tinkerer` vs `animate-tinkererMin`).

## Notes

- Contact email `ab@hoomans.dev` is hardcoded in the copy button script in index.astro
- TinkerHub founding date (September 2015) is used to calculate dynamic age display
- Font loaded via both `@fontsource-variable/dm-sans` package and Google Fonts CDN
