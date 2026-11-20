// VisionQuest — Live Image Search (Part 3: Loading, Empty, Error States & Polish)

// DOM Elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear-button");
const resultsContainer = document.getElementById("results");
const statusText = document.getElementById("status");
const resultCount = document.getElementById("result-count");
const loadingIndicator = document.getElementById("loading-indicator");
const emptyState = document.getElementById("empty-state");
const emptyStateTitle = document.getElementById("empty-state-title");
const emptyStateText = document.getElementById("empty-state-text");
const errorState = document.getElementById("error-state");
const retryButton = document.getElementById("retry-button");
const chips = document.querySelectorAll(".chip");

// Current search tracker for retry capability
let lastQuery = "";
let isSearching = false;

// Helper: Escape HTML to prevent XSS in dynamic text
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// 1. Loading State Handlers
function showLoading(query) {
  isSearching = true;

  // Update button state
  if (searchButton) {
    searchButton.disabled = true;
    const btnText = searchButton.querySelector(".button-text");
    if (btnText) btnText.textContent = "Searching…";
  }

  // Hide empty and error states
  if (emptyState) emptyState.style.display = "none";
  if (errorState) errorState.style.display = "none";

  // Show loading indicator
  if (loadingIndicator) loadingIndicator.style.display = "flex";

  // Announce to assistive tech & update count line
  if (statusText) statusText.textContent = `Searching for "${query}"...`;
  if (resultCount) {
    resultCount.innerHTML = `Searching for "<strong>${escapeHtml(query)}</strong>"…`;
  }

  // Render Skeleton Placeholders into results grid (grey skeleton placeholders)
  resultsContainer.innerHTML = "";
  const skeletonCount = 8;
  for (let i = 0; i < skeletonCount; i++) {
    const skeletonCard = document.createElement("div");
    skeletonCard.className = "skeleton-card";
    skeletonCard.setAttribute("aria-hidden", "true");
    skeletonCard.innerHTML = `
      <div class="skeleton-thumb"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    `;
    resultsContainer.appendChild(skeletonCard);
  }
}

function hideLoading() {
  isSearching = false;

  // Restore button state
  if (searchButton) {
    searchButton.disabled = false;
    const btnText = searchButton.querySelector(".button-text");
    if (btnText) btnText.textContent = "Search";
  }

  // Hide loading indicator
  if (loadingIndicator) loadingIndicator.style.display = "none";
}

// 2. Empty State Handler
function showEmpty(query) {
  hideLoading();
  resultsContainer.innerHTML = ""; // Clear placeholders/cards

  if (resultCount) {
    resultCount.innerHTML = `Showing 0 results for "<strong>${escapeHtml(query)}</strong>"`;
  }

  if (statusText) {
    statusText.textContent = `No results found for "${query}".`;
  }

  if (emptyState) {
    if (emptyStateTitle) {
      emptyStateTitle.textContent = "No results for that word. Try another search.";
    }
    if (emptyStateText) {
      emptyStateText.innerHTML = `We couldn't find any images matching "<strong>${escapeHtml(query)}</strong>". Try checking for typos or searching a broader term like <em>nature</em>, <em>architecture</em>, or <em>travel</em>.`;
    }
    emptyState.style.display = "block";
  }

  if (errorState) errorState.style.display = "none";
}

// 3. Error State Handler
function showError(query, error) {
  hideLoading();
  resultsContainer.innerHTML = ""; // Clear placeholders/cards

  console.error("Search request failed:", error);

  if (resultCount) {
    resultCount.textContent = "Search request could not be completed";
  }

  if (statusText) {
    statusText.textContent = "Something went wrong. Please try again.";
  }

  if (errorState) {
    errorState.style.display = "block";
  }

  if (emptyState) emptyState.style.display = "none";
}

// 4. Results Render Handler (with Polish & Staggered Animations)
function renderResults(items, query) {
  hideLoading();
  resultsContainer.innerHTML = ""; // Clear skeletons

  if (emptyState) emptyState.style.display = "none";
  if (errorState) errorState.style.display = "none";

  // Update Result Count
  if (resultCount) {
    const count = items.length;
    resultCount.innerHTML = `Showing <strong>${count}</strong> result${count === 1 ? "" : "s"} for "<strong>${escapeHtml(query)}</strong>"`;
  }

  if (statusText) {
    statusText.textContent = `Showing ${items.length} results for "${query}".`;
  }

  // Build Image Cards
  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "card";
    // Staggered entry animation delay
    card.style.animationDelay = `${index * 45}ms`;

    const info = item.imageinfo[0];
    const rawTitle = item.title.replace(/^File:/, "").replace(/\.[^/.]+$/, "");
    const cleanTitle = rawTitle.replace(/_/g, " ");

    // Link wrapping image
    const link = document.createElement("a");
    link.className = "card-image-link";
    link.href = info.descriptionurl || info.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `View "${cleanTitle}" on Wikimedia Commons`);

    // Image element with smooth opacity fade-in on load
    const img = document.createElement("img");
    img.className = "card-image";
    img.alt = cleanTitle;
    img.loading = "lazy";
    img.src = info.thumburl;

    img.addEventListener("load", () => {
      img.classList.add("loaded");
    });

    // Hover badge
    const badge = document.createElement("span");
    badge.className = "card-badge";
    badge.innerHTML = `View <span>↗</span>`;

    link.appendChild(img);
    link.appendChild(badge);
    card.appendChild(link);

    // Card caption / details
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const titleEl = document.createElement("p");
    titleEl.className = "card-title";
    titleEl.textContent = cleanTitle;
    titleEl.title = cleanTitle; // Native tooltip on hover

    cardBody.appendChild(titleEl);
    card.appendChild(cardBody);

    resultsContainer.appendChild(card);
  });
}

// 5. Main Search Controller with try...catch & response.ok check
async function performSearch(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return;

  lastQuery = cleanQuery;
  showLoading(cleanQuery);

  const url =
    "https://commons.wikimedia.org/w/api.php?action=query" +
    "&generator=search&gsrsearch=" +
    encodeURIComponent(cleanQuery) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*";

  try {
    const response = await fetch(url);

    // Explicitly verify response.ok
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();

    // Check for query results
    let items = [];
    if (data.query && data.query.pages) {
      // Filter items to ensure valid thumbnail URL exists
      items = Object.values(data.query.pages).filter(
        (page) =>
          page.imageinfo &&
          page.imageinfo.length > 0 &&
          page.imageinfo[0].thumburl
      );
    }

    // Check whether the result list is empty
    if (items.length === 0) {
      showEmpty(cleanQuery);
    } else {
      renderResults(items, cleanQuery);
    }
  } catch (error) {
    showError(cleanQuery, error);
  }
}

// 6. Reset to Initial Welcome State
function resetSearch() {
  if (input) input.value = "";
  lastQuery = "";
  resultsContainer.innerHTML = "";
  hideLoading();

  if (resultCount) {
    resultCount.textContent = "Showing 0 results";
  }

  if (statusText) {
    statusText.textContent = "Search to see results";
  }

  if (emptyState) {
    if (emptyStateTitle) emptyStateTitle.textContent = "Search to see results";
    if (emptyStateText) {
      emptyStateText.textContent =
        "Type a word above or click a category chip to discover stunning photographs.";
    }
    emptyState.style.display = "block";
  }

  if (errorState) errorState.style.display = "none";
  if (input) input.focus();
}

// 7. Event Listeners
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value;
  performSearch(query);
});

// Clear button
if (clearButton) {
  clearButton.addEventListener("click", resetSearch);
}

// Keyboard shortcut: Escape to clear
if (input) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      resetSearch();
    }
  });
}

// Retry button on error
if (retryButton) {
  retryButton.addEventListener("click", () => {
    if (lastQuery) {
      performSearch(lastQuery);
    } else {
      resetSearch();
    }
  });
}

// Suggestion category chips
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const query = chip.textContent.trim();
    if (input) input.value = query;
    performSearch(query);
  });
});
