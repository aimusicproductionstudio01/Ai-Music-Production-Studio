/**
 * AI Music Production Studio - CORE APPLICATION LAYER (app.js)
 * Features: High-Performance Single-Pass Hydration, Native Custom Event System, 
 * Comprehensive WCAG Keyboard Navigation, toast-driven feedback, and resilient fallbacks.
 */

(function () {
    // Config & Fallback Constants
    const DATABASE_URL = "./songs.json"; 
    const FALLBACK_STUDIO_DEMO_ID = "388481260"; // Custom studio showcase ID fallback
    const COVERS_DEFAULT_IMG = "covers/default.jpg"; // Strict image error recovery route

    /**
     * 1. BOOTLOADER INITIATION
     */
    document.addEventListener("DOMContentLoaded", () => {
        runStudioBootLoader();
    });

    async function runStudioBootLoader() {
        showLoading(); // Prevent layout flashing with active spinner state
        try {
            const response = await fetch(DATABASE_URL); 
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            // Hydrate system layout panels
            compileAndHydrateDashboard(data);
            
        } catch (error) {
            console.error("Studio Boot Error: Fallback data triggered.", error);
            renderRecoveryEnvironment();
        } finally {
            hideLoading(); // Teardown presentation spinner cleanly[cite: 2]
        }
    }

    /**
     * 2. HIGH-PERFORMANCE HYDRATION ENGINE
     */
    function compileAndHydrateDashboard(data) {

    if (!data) return;

    // Hero
    if (data.featuredSong) {
        hydrateHeroBanner({
            title: data.featuredSong.title,
            artist: data.featuredSong.language,
            youtubeId: data.featuredSong.youtubeId
        });
    }

    // Build one master songs array
    const allSongs = [];

    (data.newReleases || []).forEach((song, index) => {
        allSongs.push({
            id: "new-" + index,
            title: song.title,
            artist: song.language,
            language: song.language,
            genre: song.category,
            youtubeId: song.youtubeId,
            lyrics: "",
            audioUrl: "",
            downloadUrl: "",
            isNewRelease: true,
            isTrending: false
        });
    });

    (data.latest || []).forEach((song, index) => {
        allSongs.push({
            id: "latest-" + index,
            title: song.title,
            artist: song.language,
            language: song.language,
            genre: song.category,
            youtubeId: song.youtubeId,
            lyrics: "",
            audioUrl: "",
            downloadUrl: "",
            isNewRelease: false,
            isTrending: true
        });
    });

    hydrateSongGrid("new-releases-container", allSongs.filter(s => s.isNewRelease));
    hydrateSongGrid("trending-songs-container", allSongs.filter(s => s.isTrending));
    hydrateSongGrid("all-songs-grid", allSongs);

    if (!window.playerAttached) {
        attachGlobalClickInterceptors();
        window.playerAttached = true;
    }

    setupUnifiedSearchEngine();
}

    function hydrateHeroBanner(hero) {
        const heroTitle = document.getElementById("hero-title");
        const heroArtist = document.getElementById("hero-artist");
        const heroImg = document.getElementById("hero-thumbnail");
  
        if (heroImg) {
            const videoId = hero.youtubeId || FALLBACK_STUDIO_DEMO_ID; // Fallback to custom studio demo[cite: 2]
            heroImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            heroImg.setAttribute("loading", "lazy"); 
            heroImg.setAttribute("decoding", "async"); 

            // Resilient image error boundaries[cite: 2]
            heroImg.onerror = function() {
                this.src = COVERS_DEFAULT_IMG;
                this.onerror = null; // Prevent infinite loop triggers
            };
        }
    }

    function hydrateSongGrid(containerId, songsList) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let gridHtml = ""; 

        songsList.forEach(song => {
            const thumbUrl = song.youtubeId 
                ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg` 
                : song.coverUrl || COVERS_DEFAULT_IMG;

            // Expanded metadata attributes & dynamic focus bindings for strict WCAG support[cite: 2]
            gridHtml += `
                <div class="song-card fade-in" 
                     data-song-id="${song.id}" 
                     data-title="${song.title || ''}"
                     data-artist="${song.artist || ''}"
                     data-youtube="${song.youtubeId || ''}"
                     data-audio="${song.audioUrl || ''}" 
                     data-download="${song.downloadUrl || ''}"
                     data-language="${song.language || ''}"
                     data-genre="${song.genre || ''}"
                     data-lyrics="${encodeURIComponent(song.lyrics || '')}"
                     tabindex="0"
                     role="button"
                     aria-label="Track card: ${song.title} by ${song.artist}. Press Enter or Space to play.">
                    <div class="song-card-img-wrap">
                        <img class="song-thumb" 
                             src="${thumbUrl}" 
                             loading="lazy" 
                             decoding="async" 
                             alt="${song.title} Cover"
                             onerror="this.src='${COVERS_DEFAULT_IMG}'; this.onerror=null;">
                        <button class="card-hover-play-trigger" aria-label="Play Track" tabindex="-1">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                    </div>
                    <div class="song-details-wrap py-2">
                        <h4 class="song-title">${song.title}</h4>
                        <p class="song-artist">${song.artist}</p>
                    </div>
                    <div class="card-action-cluster mt-2">
                        <button class="btn btn-primary play-btn" tabindex="-1">Play</button>
                        <button class="btn btn-secondary lyrics-btn" tabindex="-1">Lyrics</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = gridHtml; 
    }

    /**
     * 3. EXPANDED SEARCH MATCHING WITH BLANK STATE INJECTIONS
     */
    function setupUnifiedSearchEngine() {
        const searchInput = document.getElementById("searchInput");
        if (!searchInput) return;

        searchInput.oninput = function (e) {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll(".song-card");
            let totalVisible = 0;

            cards.forEach(card => {
                const title = card.dataset.title?.toLowerCase() || "";
                const artist = card.dataset.artist?.toLowerCase() || "";
                const genre = card.dataset.genre?.toLowerCase() || "";
                const language = card.dataset.language?.toLowerCase() || "";
                
                // Flexible deep-string searching indexing criteria[cite: 2]
                const searchableString = `${title} ${artist} ${genre} ${language}`;

                if (searchableString.includes(query)) {
                    card.classList.remove("hidden"); 
                    totalVisible++;
                } else {
                    card.classList.add("hidden"); 
                }
            });

            // Dynamic Empty Search Result feedback[cite: 2]
            toggleEmptySearchResultsState(totalVisible === 0 && query !== "");
        };
    }

    function toggleEmptySearchResultsState(shouldShow) {
        let emptyStateMsg = document.getElementById("search-empty-state");
        
        if (shouldShow) {
            if (!emptyStateMsg) {
                emptyStateMsg = document.createElement("div");
                emptyStateMsg.id = "search-empty-state";
                emptyStateMsg.className = "text-center py-12 w-full fade-in";
                emptyStateMsg.innerHTML = `
                    <p class="text-zinc-400 text-lg font-medium">No songs found</p>
                    <p class="text-zinc-500 text-sm mt-1">Try searching another keyword, genre, or language.</p>
                `;
                // Inserts notice gracefully beneath core grid systems
                const primaryGrid = document.getElementById("all-songs-grid");
                if (primaryGrid) primaryGrid.parentNode.insertBefore(emptyStateMsg, primaryGrid.nextSibling);
            }
        } else {
            if (emptyStateMsg) emptyStateMsg.remove();
        }
    }

    /**
     * 4. ATTACH EVENT DELEGATION & ACCESSIBILITY HANDLERS
     */
    function attachGlobalClickInterceptors() {
        // Handle all click execution trees natively[cite: 2]
        document.body.onclick = function (event) {
            handleInteraction(event, event.target);
        };

        // Strict WCAG Accessible Keyboard Interaction Support (Enter/Space Keys)[cite: 2]
        document.body.onkeydown = function (event) {
            if (event.key === "Enter" || event.key === " ") {
                const targetCard = event.target.closest(".song-card");
                if (targetCard && event.target === targetCard) {
                    event.preventDefault(); // Stop native viewport scrolling on spacebar key strikes
                    handleInteraction(event, targetCard.querySelector(".play-btn") || targetCard);
                }
            }
        };
    }

    function handleInteraction(event, target) {
        const songCard = target.closest(".song-card");
        if (!songCard) return;

        const songId = songCard.dataset.id || songCard.getAttribute("data-song-id");
        const songTitle = songCard.dataset.title;
        const songArtist = songCard.dataset.artist;
        const songAudio = songCard.dataset.audio;

        // Route 1: Lyrics trigger
        if (target.classList.contains("lyrics-btn")) {
            event.stopPropagation();
            const rawLyrics = songCard.getAttribute("data-lyrics");
            triggerLyricsPopup(decodeURIComponent(rawLyrics));
            return;
        }

        // Route 2: Play actions
        if (target.classList.contains("play-btn") || target.closest(".card-hover-play-trigger") || target === songCard) {
            event.stopPropagation();
            dispatchMediaTrackPlay(songId, songTitle, songArtist, songAudio);
            return;
        }
    }

    /**
     * 5. EVENT-DRIVEN DISPATCH PIPELINE & CORE FUNCTIONS
     */
    function dispatchMediaTrackPlay(songId, title, artist, url) {
        // Decoupled communication via standard custom events[cite: 2]
        window.dispatchEvent(
            new CustomEvent("songPlay", {
                detail: {
                    id: songId,
                    title: title,
                    artist: artist,
                    url: url
                }
            })
        );
    }

    function triggerLyricsPopup(lyrics) {
        if (!lyrics || lyrics === "undefined" || lyrics === "") {
            showToast("Lyrics unavailable"); // Smooth modern notification toasts[cite: 2]
            return;
        }
        
        // Dispatches structural Event for lyric modal views
        window.dispatchEvent(
            new CustomEvent("showLyrics", {
                detail: { lyrics: lyrics }
            })
        );
    }

    /**
     * 6. MODERN RUNTIME TOAST ALERTS
     */
    function showToast(message) {
        let toastContainer = document.getElementById("studio-toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "studio-toast-container";
            toastContainer.style.cssText = "position:fixed; bottom:96px; right:24px; z-index:10001; display:flex; flex-direction:column; gap:8px; pointer-events:none;";
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = "fade-in";
        toast.style.cssText = "background:#10b981; color:#fff; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3); pointer-events:auto; transition: opacity 0.3s ease;";
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Graceful Fade Out Lifecycle
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * 7. STATE LOADING & RECOVERY MANAGEMENT
     */
    function showLoading() {
        let spinner = document.getElementById("studio-global-spinner");
        if (!spinner) {
            spinner = document.createElement("div");
            spinner.id = "studio-global-spinner";
            spinner.className = "text-center py-20 w-full";
            spinner.innerHTML = `
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                <p class="text-zinc-400 text-sm mt-3">Tuning instruments...</p>
            `;
            const primaryGrid = document.getElementById("all-songs-grid");
            if (primaryGrid) primaryGrid.parentNode.insertBefore(spinner, primaryGrid);
        }
    }

    function hideLoading() {
        const spinner = document.getElementById("studio-global-spinner");
        if (spinner) spinner.remove();
    }

    function renderRecoveryEnvironment() {
        // High fidelity user recovery interface replacing system layouts on error[cite: 2]
        const recoveryHTML = `
            <div class="text-center py-20 max-w-md mx-auto fade-in">
                <p class="text-red-400 text-2xl mb-2">⚠️ Unable to load songs.</p>
                <p class="text-zinc-500 text-sm mb-6">Verify your network credentials or server status and try again.</p>
                <button onclick="window.location.reload()" class="btn btn-primary py-2 px-6 rounded-full font-bold">
                    Reload
                </button>
            </div>
        `;
        const container = document.getElementById("all-songs-grid");
        if (container) container.innerHTML = recoveryHTML;
    }
})();
