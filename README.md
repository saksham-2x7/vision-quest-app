# VisionQuest

VisionQuest is an image-search application designed to let users seamlessly discover visuals from around the world. In the upcoming phases, the app will fetch real images from a public API based on the user's search queries and present them in a responsive, infinite-flowing grid.

### Design Decisions

1. **Sticky Header**: I included a sticky header so users always have access to the app's title and branding without scrolling all the way back up, improving navigation continuity.
2. **Category Chips**: A row of suggestion chips (Nature, Architecture, etc.) provides immediate, one-click search inspirations, saving the user from having to type a query from scratch.
3. **Adaptive Dark Mode Fallback**: I configured CSS custom properties with `@media (prefers-color-scheme: dark)` to gracefully adapt the UI to the user's system preferences, picking a distinct Teal and Charcoal palette over the reference app's colors.
