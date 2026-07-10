/**
 * AI Music Production Studio - UNIFIED SEARCH CORE (search.js)
 * Purpose: Provides a dedicated, instant real-time query interface.
 * Filters the active catalog by Song Title, Language, and Category.
 */

document.addEventListener("DOMContentLoaded", () => {
    initializeStudioSearchEngine();
});

/**
 * Initializes the real-time input event listeners for the search interface.
 */
function initializeStudioSearchEngine() {
    const searchBar = document.getElementById("searchInput");
    if (!searchBar) {
        console.warn("Search Module Warning: '#searchInput' element not found in current DOM layout.");
        return;
    }

    // Capture user keystrokes for instantaneous client-side filtering
    searchBar.addEventListener("input", (event) => {
        const rawQuery = event.target.value;
        executeCatalogSearch(rawQuery);
    });
    
    console.log("Search Engine Status: Operational. Monitoring Title, Language, and Category fields.");
}

/**
 * Processes the active query string against the structural song elements.
 * Supports fallback parsing against explicit data attributes if UI elements change.
 * @param {string} queryText - Raw text string from the input container.
 */
function executeCatalogSearch(queryText) {
    const cleanQuery = queryText.toLowerCase().trim();
    
    // Select all song cards across the core collection layouts (New Releases, Latest, Trending)
    const targetSongCards = document.querySelectorAll(".song-grid .song-card, .region-grid .song-card, [data-category]");

    targetSongCards.forEach(card => {
        // Extraction Layer 1: Read raw text strings from the card nodes
        const songTitle = card.querySelector("h3") ? card.querySelector("h3").innerText.toLowerCase() : "";
        
        // Extraction Layer 2: Read fallback structured category tags
        const categoricalMeta = card.getAttribute("data-category") ? card.getAttribute("data-category").toLowerCase() : "";
        const inlineMetaText = card.querySelector(".card-meta") ? card.querySelector(".card-meta").innerText.toLowerCase() : "";

        // Core Conditional Matching Logic (Title || Language || Category)
        const isTitleMatch = songTitle.includes(cleanQuery);
        const isMetaMatch = categoricalMeta.includes(cleanQuery) || inlineMetaText.includes(cleanQuery);

        if (isTitleMatch || isMetaMatch) {
            // Smoothly display matches by returning elements to their structural layout state
            card.style.display = ""; 
            card.style.opacity = "1";
            card.style.pointerEvents = "auto";
        } else {
            // Hide non-matching items completely from the grid flow
            card.style.display = "none";
            card.style.opacity = "0";
            card.style.pointerEvents = "none";
        }
    });

    // Optional: Call context feedback hooks to handle "No Results Found" alerts if a grid ends up empty
    evaluateEmptyGridStates();
}

/**
 * Structural helper that evaluates grid containers to present empty state messages if needed.
 */
function evaluateEmptyGridStates() {
    const coreGrids = document.querySelectorAll(".song-grid, #all-songs-grid, #new-releases-container");
    
    coreGrids.forEach(grid => {
        const totalVisibleCards = grid.querySelectorAll(".song-card[style=''], .song-card:not([style*='display: none'])").length;
        let emptyStateAlert = grid.parentNode.querySelector(".search-empty-notice");

        if (totalVisibleCards === 0) {
            if (!emptyStateAlert) {
                emptyStateAlert = document.createElement("div");
                emptyStateAlert.className = "search-empty-notice text-center py-8 text-zinc-500 text-xs font-medium w-full col-span-full";
                emptyStateAlert.innerHTML = `<i class="fa-solid fa-magnifying-glass-blur text-lg mb-2 block text-zinc-700"></i> No matching studio titles found.`;
                grid.appendChild(emptyStateAlert);
            }
        } else {
            if (emptyStateAlert) {
                emptyStateAlert.remove();
            }
        }
    });
}
