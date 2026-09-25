// VisionQuest — Live Image Search (Part 2: Fetch & Render)

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");
const statusText = document.getElementById("status");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

// Catch the search
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the page from reloading
  const query = input.value.trim();
  if (!query) return; // ignore empty searches

  await performSearch(query);
});

// Fetch the data
async function performSearch(query) {
  // Clear old results
  resultsContainer.innerHTML = "";
  if (emptyState) emptyState.style.display = "none";
  if (statusText) {
    statusText.style.display = "block";
    statusText.textContent = "Searching...";
  }

  const url = "https://commons.wikimedia.org/w/api.php?action=query" +
    "&generator=search&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.status);
    
    const data = await response.json();
    
    let items = [];
    if (data.query && data.query.pages) {
      items = Object.values(data.query.pages);
    }

    render(items, query);
  } catch (error) {
    console.error("Error fetching data:", error);
    if (statusText) statusText.textContent = "Error fetching results.";
  }
}

// Render the results
function render(items, query) {
  resultsContainer.innerHTML = ""; // Clear old results first

  if (items.length === 0) {
    if (statusText) statusText.textContent = "No results found.";
    if (resultCount) resultCount.textContent = "Showing 0 results";
    return;
  }

  if (statusText) statusText.style.display = "none";
  
  // Enhancement 1: Display result count
  if (resultCount) {
    resultCount.textContent = `Showing ${items.length} results for "${query}"`;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    if (item.imageinfo && item.imageinfo.length > 0) {
      const info = item.imageinfo[0];
      
      // Enhancement 2: Make each card a link that opens the full image in a new tab
      const link = document.createElement("a");
      link.href = info.descriptionurl || info.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const img = document.createElement("img");
      img.src = info.thumburl;
      // Use item title as alt text, remove "File:" prefix
      const titleText = item.title.replace(/^File:/, '');
      img.alt = titleText;
      
      link.appendChild(img);
      card.appendChild(link);

      const caption = document.createElement("p");
      caption.textContent = titleText;
      card.appendChild(caption);

      resultsContainer.appendChild(card);
    }
  });
}

// Enhancement 3: Wire up the category / quick-pick chips
const chips = document.querySelectorAll(".chip");
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    const query = chip.textContent;
    input.value = query; // update the input visually
    performSearch(query);
  });
});
