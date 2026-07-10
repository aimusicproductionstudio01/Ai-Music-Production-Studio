/**
 * AI Music Production Studio - CORE RECOGNITION ENGINE (app.js)
 * Purpose: Centralized data pipeline that reads songs.json and dynamically maps 
 * layout elements, components, collections, categories, and channels.[cite: 1]
 */

// Centralized channel hub mappings matching official studio targets
const channelRegistry = {
    "Hindi": "https://www.youtube.com/@Ai_HindiGaana-p4w",
    "Bangla": "https://www.youtube.com/@Ai_BanglaGaan_11",
    "Bhakti": "https://www.youtube.com/@Ai_BhaktiGaana",
    "Bhojpuri": "https://www.youtube.com/@Ai_BhojpuriGaana",
    "English": "https://www.youtube.com/@Ai_EnglishSongs-01"
};

// Application Global Memory Array State Cache
let masterStudioPlaylist = [];

document.addEventListener("DOMContentLoaded", () => {
    runStudioBootLoader();
});

/**
 * Initializes the presentation runtime lifecycle.
 */
function runStudioBootLoader() {
    syncUserAuthentication();
    setupUnifiedSearchEngine();
    
    console.log("System Status: Synchronizing data pipelines via songs.json...");
    
    // Dynamic absolute path resolver safely prevents root-level breaking loops
    const databaseEndpoint = window.location.pathname.includes('index.html') 
        ? window.location.href.replace('index.html', 'songs.json')
        : window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'songs.json';

    fetch(databaseEndpoint)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Matrix Disconnect: Status code ${response.status}`);
            return response.json();
        })
        .then(databasePayload => {
            console.log("Database payload extracted successfully. Processing blocks...");
            compileAndHydrateDashboard(databasePayload);
        })
        .catch(err => {
            console.error("🔴 Matrix Boot Failure: ", err.message);
            deployLocalEmergencyBackup();
        });
}

/**
 * Single pass template generator. Reads JSON arrays and paints structural grids.
 */
function compileAndHydrateDashboard(data) {
    // 1. EXTRACT STATE TO GLOBAL PLAYLIST MEMORY LOOP FOR THE MEDIA PLAYER
    if (data.latest) masterStudioPlaylist = [...data.latest];
    if (data.newReleases) {
        data.newReleases.forEach(track => {
            if (!masterStudioPlaylist.some(t => t.youtubeId === track.youtubeId)) {
                masterStudioPlaylist.unshift(track); // Add fresh unique records to head of track stream
            }
        });
    }

    // Inform playback layer that the centralized manifest playlist is cached
    window.studioTrackCache = masterStudioPlaylist;

    // 2. COMPONENT HYDRATION: FEATURED HERO BANNER ARCHITECTURE[cite: 1]
    const hero = data.featuredSong;
    if (hero && document.getElementById("featured-hero")) {
        document.getElementById("hero-title").innerText = hero.title;[cite: 1]
        document.getElementById("hero-desc").innerText = hero.description;[cite: 1]
        document.getElementById("hero-tag").innerText = `FEATURED MASTER • ${hero.language} • ${hero.category}`;[cite: 1]
        document.getElementById("hero-thumbnail").src = `https://img.youtube.com/vi/${hero.youtubeId}/maxresdefault.jpg`;[cite: 1]
        document.getElementById("hero-play-btn").setAttribute("data-video-id", hero.youtubeId);
        document.getElementById("hero-play-btn").setAttribute("data-title", hero.title);
        document.getElementById("hero-play-btn").setAttribute("data-meta", `${hero.language} • ${hero.category}`);
        document.getElementById("hero-play-btn").setAttribute("data-lyrics", hero.lyricsFile || "");
    }

    // 3. COMPONENT HYDRATION: NEW RELEASES MODAL GRID LAYER[cite: 1]
    if (data.newReleases && document.getElementById("new-releases-container")) {
        let buffer = "";
        data.newReleases.forEach(track => {
            buffer += `
                <div class="song-card group" data-category="${track.category} ${track.language}">
                    <div class="relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video">
                        <img src="https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg" class="song-thumb" loading="lazy">
                        <button class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer core-play-trigger" 
                                data-video-id="${track.youtubeId}" data-title="${cleanQuotes(track.title)}" data-meta="${track.language} • ${track.category}" data-lyrics="${track.lyricsFile || ""}">
                            <div class="w-10 h-10 bg-emerald-500 text-black rounded-full flex items-center justify-center text-sm shadow-xl"><i class="fa-solid fa-play ml-0.5"></i></div>
                        </button>
                    </div>
                    <div>
                        <h3>${track.title}</h3>
                        <p class="card-meta">${track.category} • ${track.language}</p>
                    </div>
                </div>`;
        });
        document.getElementById("new-releases-container").innerHTML = buffer;
    }

    // 4. COMPONENT HYDRATION: TRENDING MATRIX LOOPS[cite: 1]
    if (data.latest && document.getElementById("trending-songs-container")) {
        let buffer = "";
        data.latest.slice(0, 2).forEach(track => {
            buffer += `
                <div class="song-card group" data-category="${track.category} ${track.language}">
                    <div class="flex items-center justify-between gap-3 w-full">
                        <div class="flex items-center gap-3 truncate flex-1">
                            <img src="https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg" class="w-14 h-10 object-cover rounded-md border border-zinc-800 flex-shrink-0" loading="lazy">
                            <div class="truncate flex-1 min-w-0">
                                <h3>${track.title}</h3>
                                <p class="card-meta"><i class="fa-solid fa-fire text-amber-500"></i> ${track.category}</p>
                            </div>
                        </div>
                        <button class="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-xs border border-zinc-800 text-zinc-300 hover:text-white flex-shrink-0 cursor-pointer core-play-trigger" 
                                data-video-id="${track.youtubeId}" data-title="${cleanQuotes(track.title)}" data-meta="${track.language} • ${track.category}" data-lyrics="${track.lyricsFile || ""}">
                            <i class="fa-solid fa-play ml-0.5"></i>
                        </button>
                    </div>
                </div>`;
        });
        document.getElementById("trending-songs-container").innerHTML = buffer;
    }

    // 5. COMPONENT HYDRATION: LATEST & ALL MASTER ENTRIES LISTING[cite: 1]
    if (data.latest && document.getElementById("all-songs-grid")) {
        let buffer = "";
        data.latest.forEach(track => {
            const channelUrl = channelRegistry[track.language] || "https://www.youtube.com";
            buffer += `
                <div class="song-card group" data-category="${track.category} ${track.language}">
                    <div class="flex items-center justify-between gap-3 w-full">
                        <div class="flex items-center gap-3 truncate min-w-0 flex-1">
                            <img src="https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg" class="w-12 h-9 object-cover rounded-md border border-zinc-800 flex-shrink-0" loading="lazy">
                            <div class="truncate flex-1 min-w-0">
                                <h3>${track.title}</h3>
                                <p class="card-meta">${track.category} • ${track.language}</p>
                            </div>
                        </div>
                        <div class="song-actions flex-shrink-0 flex items-center gap-1">
                            <button class="w-8 h-8 rounded-full text-zinc-400 hover:text-emerald-400 flex items-center justify-center cursor-pointer core-play-trigger" 
                                    data-video-id="${track.youtubeId}" data-title="${cleanQuotes(track.title)}" data-meta="${track.language} • ${track.category}" data-lyrics="${track.lyricsFile || ""}">
                                <i class="fa-solid fa-circle-play text-lg"></i>
                            </button>
                            <a href="${channelUrl}" target="_blank" class="text-[9px] font-bold border border-zinc-800 bg-zinc-950 text-zinc-400 px-2 py-1 rounded hover:bg-emerald-500 hover:text-black transition-all touch-target">${track.language}</a>
                        </div>
                    </div>
                </div>`;
        });
        document.getElementById("all-songs-grid").innerHTML = buffer;
    }

    // 6. COMPONENT HYDRATION: UPCOMING RELEASES SCHEDULE FEED[cite: 1]
    if (data.upcoming && document.getElementById("upcoming-container")) {
        let buffer = "";
        data.upcoming.forEach(track => {
            buffer += `
                <div class="bg-zinc-950 p-2.5 rounded-xl border border-zinc-850 flex items-center justify-between">
                    <div class="truncate pr-2">
                        <span class="text-xs font-bold text-zinc-300 block truncate">${track.title}</span>
                        <span class="text-[9px] text-zinc-500">${track.language} • ${track.category}</span>
                    </div>
                    <span class="text-[8px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-emerald-400">${track.releaseDate}</span>
                </div>`;
        });
        document.getElementById("upcoming-container").innerHTML = buffer;
    }

    // 7. COMPONENT HYDRATION: LANGUAGES & CATEGORY HUB ROUTERS[cite: 1]
    if (data.languages && document.getElementById("language-playlists-container")) {
        let buffer = "";
        Object.keys(data.languages).forEach(lang => {
            buffer += `
                <a href="${channelRegistry[lang] || 'https://www.youtube.com'}" target="_blank" class="p-2 rounded-lg hover:bg-zinc-900 transition-colors flex items-center justify-between group text-xs text-zinc-400 hover:text-white touch-target">
                    <span class="font-bold flex items-center gap-2"><i class="fa-solid fa-compact-disc text-zinc-600 group-hover:text-emerald-400"></i> ${lang} Studio Hub</span>
                    <i class="fa-solid fa-chevron-right text-[9px] text-zinc-700"></i>
                </a>`;
        });
        document.getElementById("language-playlists-container").innerHTML = buffer;
    }

    // 8. COMPONENT HYDRATION: LIVE BROADCAST STUDIO NEWS FEED[cite: 1]
    if (data.news && document.getElementById("news-feed-container")) {
        let buffer = "";
        data.news.forEach(item => {
            buffer += `
                <div class="bg-zinc-950 p-3 rounded-xl border border-zinc-850 space-y-1">
                    <h4 class="text-xs font-bold text-zinc-200">${item.title}</h4>
                    <p class="text-[11px] text-zinc-400 leading-normal">${item.content}</p>
                </div>`;
        });
        document.getElementById("news-feed-container").innerHTML = buffer;
    }

    // Attach global tracking handlers to modern click interception channels
    attachGlobalClickInterceptors();
}

/**
 * Intercepts clicks on play triggers and broadcasts them to the player.js file.
 */
function attachGlobalClickInterceptors() {
    document.body.addEventListener("click", event => {
        const trigger = event.target.closest(".core-play-trigger, #hero-play-btn");
        if (!trigger) return;

        event.preventDefault();
        
        const trackData = {
            id: trigger.getAttribute("data-video-id"),
            title: trigger.getAttribute("data-title"),
            meta: trigger.getAttribute("data-meta"),
            lyrics: trigger.getAttribute("data-lyrics")
        };

        // Fire custom window cross-module script dispatch
        const dispatchEvent = new CustomEvent("StudioModulePlayRequest", { detail: trackData });
        window.dispatchEvent(dispatchEvent);
    });
}

/**
 * Provides an instant live query search filter matching both titles and metadata.[cite: 1]
 */
function setupUnifiedSearchEngine() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("keyup", function() {
        const query = this.value.toLowerCase();
        document.querySelectorAll(".song-grid .song-card, .region-grid .song-card").forEach(card => {
            const title = card.querySelector("h3") ? card.querySelector("h3").innerText.toLowerCase() : "";
            const category = card.dataset.category ? card.dataset.category.toLowerCase() : "";

            if (title.includes(query) || category.includes(query)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });
}

/**
 * Synchronizes browser memory structures for active accounts.
 */
function syncUserAuthentication() {
    const isLogged = localStorage.getItem("loggedIn") === "true" || sessionStorage.getItem("loggedIn") === "true";
    const currentEmail = localStorage.getItem("currentUser");
    const slot = document.getElementById("auth-nav-slot");

    if (!slot) return;

    if (isLogged && currentEmail) {
        const raw = localStorage.getItem("user_" + currentEmail);
        let name = "Producer Account";
        if (raw) name = JSON.parse(raw).name || name;

        slot.innerHTML = `
            <div class="flex items-center gap-3 bg-zinc-900 border border-zinc-800 py-1 px-3 rounded-full">
                <div class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-black font-black"><i class="fa-solid fa-user"></i></div>
                <span class="text-zinc-300 text-xs font-bold max-w-[90px] truncate">${name}</span>
                <button onclick="handleGlobalLogout()" class="text-zinc-600 hover:text-red-400 text-xs pl-1 cursor-pointer transition-colors"><i class="fa-solid fa-power-off"></i></button>
            </div>`;
    }
}

function handleGlobalLogout() {
    localStorage.removeItem("loggedIn");
    sessionStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    window.location.reload();
}

function deployLocalEmergencyBackup() {
    console.warn("Deploying local environment recovery configurations.");
    const productionRecoveryMatrix = {
        "featuredSong": { "title": "AI Production Engine Live", "description": "Local server configurations are offline. Run via live environment servers to load external files.", "language": "System", "category": "Core", "youtubeId": "dQw4w9WgXcQ" },
        "newReleases": [], "latest": [], "upcoming": [], "languages": {}, "news": [{ "title": "System Diagnostic Note", "content": "Running fallback context architecture parameters." }]
    };
    compileAndHydrateDashboard(productionRecoveryMatrix);
}

function cleanQuotes(str) {
    return str ? str.replace(/"/g, '&quot;').replace(/'/g, "\\'") : "";
}
