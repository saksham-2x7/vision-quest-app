# VisionQuest 🌐✨

**VisionQuest** is an elegant, responsive image search web application built with plain HTML, CSS, and modern JavaScript (no frameworks or build tools required). It connects directly to the Wikimedia Commons open API to deliver rich, high-resolution visuals from photographers and contributors worldwide.

---

## 🚀 Live Demo & Repository

- **Live URL**: https://vision-quest-omega.vercel.app
- **GitHub Pages**: https://saksham-2x7.github.io/vision-quest-app/
- **GitHub Repository**: https://github.com/saksham-2x7/vision-quest-app

---

## ✨ Features & Milestones

### Part 1: Scaffold & Responsive Search UI
- **Branded Design**: Clean emerald and cyan gradient identity against deep slate backgrounds with full light/dark system mode support.
- **Sticky Header**: Fixed navigation with blurred glass backdrop so search controls remain easily accessible while exploring results.
- **Category Chips**: Quick-pick chips (*Nature*, *Architecture*, *Wildlife*, *Travel*, *Abstract*) for instant one-click searches.
- **Responsive CSS Grid**: Dynamic auto-fill grid that cleanly adapts to phones, tablets, and wide monitors.

### Part 2: Live Fetch & DOM Rendering
- **Wikimedia Commons API**: Fetches high-resolution images asynchronously using standard `fetch()` and query parameters.
- **Dynamic Card Generation**: Securely constructs accessible semantic HTML cards with title captions, alt text, and links opening the full Wikimedia source in a new tab.

### Part 3: Comprehensive State Handling, Polish & Deployment
- **Loading State**:
  - Displays an animated emerald/cyan spinner with active progress indicator.
  - Renders 8 shimmering grey skeleton card placeholders in the grid to provide instant visual layout stability while data loads.
  - Temporarily disables the search button and displays "Searching…" to avoid duplicate concurrent fetches.
- **Empty State**:
  - Explicitly detects when a search returns 0 results (e.g. searching nonsense like `zxqwlk`).
  - Replaces blank grids with a clear, helpful message: *"No results for that word. Try another search."* along with tips to try broader topics.
- **Error State**:
  - All network requests are wrapped in `try...catch` and explicitly check `response.ok`.
  - On network failures or API HTTP errors, the app displays a friendly error banner: *"Something went wrong. Please try again."* along with a direct **Try Again** button.
- **Polish**:
  - **Result Count**: Dynamic result counter displaying exact counts (`Showing 12 results for "nature"`).
  - **Staggered Animations**: Smooth `@keyframes cardFadeIn` with staggered entry delays.
  - **Image Fade-in**: Images load with lazy loading and fade in smoothly upon decode.
  - **Hover Micro-Interactions**: Card hover elevation and external link indicator badge.
  - **Clear Control & Keyboard Support**: Full reset functionality via the Clear button and `Escape` key.
  - **Mobile Touch Targets**: Responsive adjustments with 44px minimum tap targets.

---

## 🛠️ Built With

- **HTML5**: Semantic tags, accessible ARIA attributes (`aria-live`, `aria-label`, `role="status"`, `role="alert"`).
- **CSS3**: Modern CSS Grid, Flexbox, custom CSS variables, keyframe animations, glassmorphism backdrop filters.
- **Vanilla JavaScript (ES6+)**: `async/await`, `fetch`, DOM manipulation, event listeners.
