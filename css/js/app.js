/**
 * AI Music Production Studio - Core Web Application Engine
 * Framework-free high-performance DOM controller.
 */

const channelRegistry = {
    "Hindi": "https://www.youtube.com/@Ai_HindiGaana-p4w",
    "Bangla": "https://www.youtube.com/@Ai_BanglaGaan_11",
    "Bhakti": "https://www.youtube.com/@Ai_BhaktiGaana",
    "Bhojpuri": "https://www.youtube.com/@Ai_BhojpuriGaana",
    "English": "https://www.youtube.com/@Ai_EnglishSongs-01"
};

let currentLoadedId = "";
let currentLoadedTitle = "";
let currentLyricsPath = "";

document.addEventListener("DOMContentLoaded", () => {
    initializeApplicationRuntime();
});

function initializeApplicationRuntime() {
    syncSessionAuthentication();
    setupUnifiedSearchEngine();
    registerFixedInterfaceHandlers();

    // Force an absolute fallback path mapping to prevent root resolution failures
    const jsonPath = window.location.pathname.includes('index.html') 
        ? window.location.href.replace('index.html', 'songs.json')
        : window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'songs.json';

    console.log("System Status: Pinging Database Matrix at Location ->", jsonPath);

    // Fetch database matrix safely once and cache compilation string
    fetch(jsonPath)
        .then(response => {
            console.log("Network Status Response Code:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status} - Registry connectivity failure.`);
            }
            return response.json();
        })
        .then(songsData => {
            console.log("Database successfully extracted. Parsing records...", songsData);
            hydrateCompletePlatform(songsData);
        })
        .catch(err => {
            console.error("🔴 CRITICAL Core Fetch Failure! Error Details:", err.message);
            displayHardcodedFallbackData();
        });
}

/**
 * HARDCODED IN-MEMORY EMERGENCY ENGINE FALLBACK
 * Runs safely if your local file system or deployment routing blocks the songs.json asset.
 */
function displayHardcodedFallbackData() {
    console.warn("⚠️ System deploying local safe operational environment variables.");
    const fallbackRegistry = {
        "featuredSong": {
            "title": "Welcome to AI Music Production Studio",
            "description": "If you see this, your browser blocked your file fetch. Use VS Code Live Server or upload online to load songs.json automatically.",
            "language": "System",
            "category": "Demo",
            "youtubeId": "dQw4w9WgXcQ"
        },
        "newReleases": [
            { "title": "System Diagnostic Mode Track", "language": "English", "category": "Demo", "youtubeId": "dQw4w9WgXcQ" }
        ],
        "latest": [
            { "title": "Fallback Interface Matrix Active", "language": "Hindi", "category": "Demo", "youtubeId": "dQw4w9WgXcQ" }
        ],
        "upcoming": [
            { "title": "Production Deployment Syncing", "language": "System", "category": "Demo", "releaseDate": "SOON" }
        ],
        "languages": { "Hindi": {}, "Bangla": {} },
        "news": [
            { "title": "Local System Notice", "content": "Fetch sequence manually redirected to internal backup matrix arrays due to runtime environment path restrictions." }
        ]
    };
    hydrateCompletePlatform(fallbackRegistry);
}

/**
 * 1. HIGH PERFORMANCE SINGLE PASS STRING ACCUMULATION DESIGN PATTERNS
 */
function hydrateCompletePlatform(data) {
    // 1. HERO CONFIGURATION
    const featured = data.featuredSong;
    if (featured && document.getElementById("hero-title")) {
        document.getElementById("hero-title").innerText = featured.title;
        document.getElementById("hero-desc").innerText = featured.description;
        document.getElementById("hero-tag").innerText = `FEATURED MASTER • ${featured.language} • ${featured.category}`;
        document.getElementById("hero-thumbnail").src = `https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`;
        document.getElementById("hero-play-btn").setAttribute("onclick", `playSong('${escapeStr(featured.title)}', '${featured.youtubeId}', '${featured.language}', '${featured.lyricsFile || ""}')`);
    }

    // 2. HYDRATE NEW RELEASES VIA HIGH-SPEED STREAM BUILDERS
    if (data.newReleases && document.getElementById("new-releases-container")) {
        let htmlBuffer = "";
        data.newReleases.forEach(track => {
            htmlBuffer += `
                <div class="song-card group" data-category="${track.category} ${track.language}">
                    <div class="relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video">
                        <img src="https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg" class="song-thumb" loading="lazy">
                        <button onclick="playSong('${escapeStr(track.title)}', '${track.youtubeId}', '${track.language}', '${track.lyricsFile || ""}')" class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer touch-target">
                            <div class="w-10 h-10 bg-emerald-500 text-black rounded-full flex items-center justify-center text-sm shadow-xl"><i class="fa-solid fa-play ml-0.5"></i></div>
                        </button>
                    </div>
                    <div>
                        <h3>${track.title}</h3>
                        <p class="card-meta">${track.category} • ${track.language}</p>
                    </div>
                </div>
            `;
        });
        document.getElementById("new-releases-container").innerHTML = htmlBuffer;
    }

    // 3. HYDRATE TRENDING MATRIX NODES
    if (data.latest && document.getElementById("trending-songs-container")) {
        let htmlBuffer = "";
        data.latest.slice(0, 2).forEach(track => {
            htmlBuffer += `
                <div class="song-card group" data-category="${track.category} ${track.language}">
                    <div class="flex items-center justify-between gap-3 w-full">
                        <div class="flex items-center gap-3 truncate flex-1">
                            <img src="https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg" class="w-14 h-10 object-cover rounded-md border border-zinc-800 flex-shrink-0" loading="lazy">
                            <div class="truncate flex-1 min-w-0">
                                <h3>${track.title}</h3>
                                <p class="card-meta"><i class="fa-solid fa-fire text-amber-500"></i> ${track.category}</p>
                            </div>
                        </div>
                        <button onclick="playSong('${escapeStr(track.title)}', '${track.youtubeId}', '${track.language}', '${track.lyricsFile || ""}')" class="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-xs border border-zinc-800 text-zinc-300 hover:text-white flex-shrink-0 cursor-pointer touch-target"><i class="fa-solid fa-play ml-0.5"></i></button>
                    </div>
                </div>
            `;
        });
        document.getElementById("trending-songs-container").innerHTML = htmlBuffer;
    }

    // 4. HYDRATE COMPREHENSIVE PRODUCTION SYSTEM ENTRIES
    if (data.latest && document.getElementById("all-songs-grid")) {
        let htmlBuffer = "";
        data.latest.forEach(track => {
            const chLink = channelRegistry[track.language] || "https://www.youtube.com";
            htmlBuffer += `
                <div class="song-card group" data-category="${track.category} ${track.language}">
                    <div class="flex items-center justify-between gap-3 w-full">
                        <div class="flex items-center gap-3 truncate min-w-0 flex-1">
                            <img src="https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg" class="w-12 h-9 object-cover rounded-md border border-zinc-800 flex-shrink-0" loading="lazy">
                            <div class="truncate flex-1 min-w-0">
                                <h3>${track.title}</h3>
                                <p class="card-meta">${track.category}</p>
                            </div>
                        </div>
                        <div class="song-actions flex-shrink-0">
                            <button onclick="playSong('${escapeStr(track.title)}', '${track.youtubeId}', '${track.language}', '${track.lyricsFile || ""}')" class="btn p-1 text-sm text-zinc-400 hover:text-white cursor-pointer touch-target"><i class="fa-solid fa-circle-play"></i></button>
                            <a href="${chLink}" target="_blank" class="btn text-[8px] font-mono border border-zinc-800 bg-zinc-950 text-zinc-400 px-2 py-1 rounded hover:bg-emerald-500 hover:text-black touch-target">${track.language}</a>
                        </div>
                    </div>
                </div>
            `;
        });
        document.getElementById("all-songs-grid").innerHTML = htmlBuffer;
    }

    // 5. SIDEBAR PACKET ACCUMULATIONS
    if (data.upcoming && document.getElementById("upcoming-container")) {
        let htmlBuffer = "";
        data.upcoming.forEach(track => {
            htmlBuffer += `
                <div class="bg-zinc-950 p-2.5 rounded-xl border border-zinc-850 flex items-center justify-between">
                    <div class="truncate pr-2">
                        <span class="text-xs font-bold text-zinc-300 block truncate">${track.title}</span>
                        <span class="text-[9px] text-zinc-500">${track.language} • ${track.category}</span>
                    </div>
                    <span class="text-[8px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-emerald-400">${track.releaseDate}</span>
                </div>
            `;
        });
        document.getElementById("upcoming-container").innerHTML = htmlBuffer;
    }

    if (data.languages && document.getElementById("language-playlists-container")) {
        let htmlBuffer = "";
        Object.keys(data.languages).forEach(lang => {
            htmlBuffer += `
                <a href="${channelRegistry[lang] || 'https://www.youtube.com'}" target="_blank" class="p-2 rounded-lg hover:bg-zinc-900 transition-colors flex items-center justify-between group text-xs text-zinc-400 hover:text-white touch-target">
                    <span class="font-bold flex items-center gap-2"><i class="fa-solid fa-compact-disc text-zinc-600 group-hover:text-emerald-400"></i> ${lang} Production</span>
                    <i class="fa-solid fa-chevron-right text-[9px] text-zinc-700"></i>
                </a>
            `;
        });
        document.getElementById("language-playlists-container").innerHTML = htmlBuffer;
    }

    if (data.news && document.getElementById("news-feed-container")) {
        let htmlBuffer = "";
        data.news.forEach(item => {
            htmlBuffer += `
                <div class="bg-zinc-950 p-3 rounded-xl border border-zinc-850 space-y-1">
                    <h4 class="text-xs font-bold text-zinc-200">${item.title}</h4>
                    <p class="text-[11px] text-zinc-400 leading-normal">${item.content}</p>
                </div>
            `;
        });
        document.getElementById("news-feed-container").innerHTML = htmlBuffer;
    }
}

/**
 * 2. LIVE QUERY FILTERS
 */
function setupUnifiedSearchEngine() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("keyup", function() {
        const value = this.value.toLowerCase();

        document.querySelectorAll(".song-card").forEach(card => {
            const h3Element = card.querySelector("h3");
            if (!h3Element) return;

            const title = h3Element.innerText.toLowerCase();
            const category = card.dataset.category ? card.dataset.category.toLowerCase() : "";

            if (title.includes(value) || category.includes(value)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });
}

/**
 * 3. INTERFACE EVENT REGISTRATION
 */
function registerFixedInterfaceHandlers() {
    const closeLyricsBtn = document.getElementById("close-lyrics-btn");
    if (closeLyricsBtn) closeLyricsBtn.addEventListener("click", closeLyricsPanel);

    const playerLyricsBtn = document.getElementById("player-lyrics-btn");
    if (playerLyricsBtn) playerLyricsBtn.addEventListener("click", displayTrackLyrics);
}

function playSong(title, youtubeId, language = "Studio Track", lyricsFile = "") {
    const playerPanel = document.getElementById("sticky-audio-player");
    if (!playerPanel) return;

    playerPanel.classList.remove("hidden");
    
    currentLoadedId = youtubeId;
    currentLoadedTitle = title;
    currentLyricsPath = lyricsFile || `lyrics/${youtubeId}.txt`;
    
    document.getElementById("playerTitle").innerText = title;
    document.getElementById("player-subtitle").innerText = `${language} Channel Production`;
    document.getElementById("playerImage").src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    document.getElementById("player-external-link").href = `https://www.youtube.com/watch?v=${youtubeId}`;
    
    document.getElementById("youtubePlayer").src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
}

function displayTrackLyrics() {
    if (!currentLoadedId) return;

    const panel = document.getElementById("lyrics-panel");
    const body = document.getElementById("lyrics-body");
    if (!panel || !body) return;

    document.getElementById("lyrics-track-title").innerText = currentLoadedTitle;
    panel.classList.remove("opacity-0", "pointer-events-none");
    body.innerHTML = `<div class="text-zinc-500 text-xs uppercase font-bold tracking-widest py-8"><i class="fa-solid fa-circle-notch fa-spin mr-2 text-emerald-400"></i> Loading text nodes...</div>`;

    fetch(currentLyricsPath)
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(text => {
            body.innerHTML = text.trim().split("\n").map(line => `<p class="hover:text-white transition-colors py-0.5">${line}</p>`).join('');
        })
        .catch(() => {
            body.innerHTML = `
                <div class="text-center py-6 space-y-2">
                    <i class="fa-solid fa-microphone-slash text-zinc-700 text-xl"></i>
                    <p class="text-xs text-zinc-500">No data text found at path:</p>
                    <code class="text-[10px] bg-zinc-950 px-2 py-1 rounded border border-zinc-800 font-mono text-amber-500">${currentLyricsPath}</code>
                </div>`;
        });
}

function closeLyricsPanel() {
    const panel = document.getElementById("lyrics-panel");
    if (panel) panel.classList.add("opacity-0", "pointer-events-none");
}

function syncSessionAuthentication() {
    const isLocalLogged = localStorage.getItem("loggedIn") === "true";
    const isSessionLogged = sessionStorage.getItem("loggedIn") === "true";
    const currentEmail = localStorage.getItem("currentUser");
    const navSlot = document.getElementById("auth-nav-slot");

    if (!navSlot) return;

    if ((isLocalLogged || isSessionLogged) && currentEmail) {
        const rawUser = localStorage.getItem("user_" + currentEmail);
        let userName = "Producer Profile";
        let userAvatar = "logo/logo.png";

        if (rawUser) {
            const parsedUser = JSON.parse(rawUser);
            userName = parsedUser.name || userName;
            userAvatar = parsedUser.avatar || userAvatar;
        }

        navSlot.innerHTML = `
            <div class="flex items-center gap-3.5 bg-zinc-900 border border-zinc-800 py-1.5 pl-2 pr-3.5 rounded-full">
                <img src="${userAvatar}" onerror="this.src='logo.png'" alt="Profile Avatar" class="w-6 h-6 rounded-full object-cover border border-zinc-750">
                <span class="text-zinc-300 font-bold max-w-[100px] truncate">${userName}</span>
                <button onclick="handleUserLogout()" class="text-zinc-500 hover:text-red-400 text-xs transition-colors cursor-pointer ml-1 touch-target">
                    <i class="fa-solid fa-power-off"></i>
                </button>
            </div>
        `;
    }
}

function handleUserLogout() {
    localStorage.removeItem("loggedIn");
    sessionStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    alert("Logged out successfully.");
    window.location.reload();
}

function escapeStr(str) {
    return str ? str.replace(/'/g, "\\'") : '';
}
