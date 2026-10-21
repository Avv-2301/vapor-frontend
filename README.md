# Vapor storefront

A responsive React storefront implemented from the supplied HTML, screenshot, and design specification. The original artwork is stored locally in public/images.

## Development

Run `npm install` and `npm run dev` to start the app. `npm run build` creates the production bundle in dist. `npm run lint` checks the source.

## Structure

- src/components: navigation, featured carousel, shared game cards and pricing, discovery, newsletter, and footer.
- src/data/store.js: game catalog and category data.
- src/App.jsx: page composition, filters, wishlist state, and detail dialogs.
- src/index.css: design tokens and global styles.
- src/App.css: storefront layout, component styles, and responsive breakpoints.
- public/images: reference artwork used by the storefront.

## Interactions

The featured carousel uses Swiper for dragging, keyboard navigation, and slide transitions, while screenshot previews remain in each game's sidebar. Search matches game titles and tags; categories filter the catalog; discovery tabs change the list; game cards open details; and the wishlist persists on the device. The newsletter validates the email and saves preferences locally, with explicit demo confirmation.

This is a frontend preview. Purchases, accounts, client downloads, live broadcasts, and email delivery require backend integration. Google Fonts supplies Inter and Space Grotesk, with system sans-serif fallbacks.
