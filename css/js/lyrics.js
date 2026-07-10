/**
 * AI Music Production Studio - LYRICS MANAGEMENT ENGINE (lyrics.js)
 * Purpose: Dynamically extracts, parses, and injects .txt lyrics files 
 * into a highly responsive modal overlay component.
 */

document.addEventListener("DOMContentLoaded", () => {
    initializeStudioLyricsEngine();
});

/**
 * Attaches operational click event handlers to target modal control elements.
 */
function initializeStudioLyricsEngine() {
    const closeLyricsBtn = document.getElementById("close-lyrics-btn");
    const lyricsModalOverlay = document.getElementById("lyrics-panel");

    // Close modal via traditional click button
    if (closeLyricsBtn) {
        closeLyricsBtn.addEventListener("click", closeLyricsModalWindow);
    }

    // Close modal if user clicks outside the text container on the background backdrop
    if (lyricsModalOverlay) {
        lyricsModalOverlay.addEventListener("click", (event) => {
            if (event.target === lyricsModalOverlay) {
                closeLyricsModalWindow();
            }
        });
    }

    // Monitor for escape key triggers to close modal cleanly for access control
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLyricsModalWindow();
        }
    });

    console.log("Lyrics Display Engine: Initialized. Awaiting track presentation handshakes.");
}

/**
 * Fetches textual track nodes dynamically and reveals the modal overlay window.
 * @param {string} trackTitle - Label text of the target song
 * @param {string} textFilePath - Location path of the asset (e.g., 'lyrics/chandni.txt')
 */
function openAndLoadLyricsModal(trackTitle, textFilePath) {
    const panel = document.getElementById("lyrics-panel");
    const body = document.getElementById("lyrics-body");
    const titleHeader = document.getElementById("lyrics-track-title");

    if (!panel || !body) {
        console.error("Lyrics Module Error: Structural DOM layout components are missing.");
        return;
    }

    // Sync header title display metadata
    if (titleHeader) {
        titleHeader.innerText = trackTitle || "Studio Composition Text Nodes";
    }

    // Make the panel visible instantly by stripping classes
    panel.classList.remove("opacity-0", "pointer-events-none", "hidden");
    panel.classList.add("flex"); // Forces crisp alignment flexbox grid rendering

    // Inject temporary animated loader graphic while network payload downloads
    body.innerHTML = `
        <div class="text-zinc-500 text-xs uppercase font-bold tracking-widest py-12 text-center w-full">
            <i class="fa-solid fa-circle-notch fa-spin mr-2 text-emerald-400"></i> Fetching text structures...
        </div>`;

    // Establish targeted resolve route address parameters
    const dynamicTargetRoute = textFilePath || "lyrics/default.txt";

    fetch(dynamicTargetRoute)
        .then(response => {
            if (!response.ok) throw new Error(`Resource 404 tracking error.`);
            return response.text();
        })
        .then(rawTextData => {
            // Clean up Carriage Return structures and map arrays down to distinct HTML elements
            const optimizedLinesArray = rawTextData.trim().split("\n");
            
            body.innerHTML = optimizedLinesArray.map(line => {
                const cleanLine = line.trim();
                if (cleanLine === "") return `<div class="h-4"></div>`; // Clean spacer blocks between verses
                return `<p class="hover:text-white text-zinc-300 transition-colors text-center py-1 font-medium tracking-wide leading-relaxed">${cleanLine}</p>`;
            }).join('');
        })
        .catch(() => {
            // Error handling fallback template if file path does not contain a valid txt document
            body.innerHTML = `
                <div class="text-center py-12 space-y-3 w-full">
                    <i class="fa-solid fa-microphone-slash text-zinc-700 text-2xl"></i>
                    <p class="text-xs text-zinc-500 font-bold">No localized transcription matrix found at path:</p>
                    <code class="text-[10px] bg-zinc-950 px-2.5 py-1.5 rounded border border-zinc-800 font-mono text-amber-500 inline-block">${dynamicTargetRoute}</code>
                </div>`;
        });
}

/**
 * Adds styling attributes to safely hide the active popup window modal layout.
 */
function closeLyricsModalWindow() {
    const panel = document.getElementById("lyrics-panel");
    if (panel) {
        panel.classList.add("opacity-0", "pointer-events-none");
        
        // Timeout prevents harsh graphic blinking states during transition transformations
        setTimeout(() => {
            if (panel.classList.contains("opacity-0")) {
                panel.classList.add("hidden");
            }
        }, 200);
    }
}

// Global Cross-Module Bridge Intercept Hook (Hooks cleanly into your player.js button trigger)
window.requestLyricsModuleActivation = function(title, path) {
    openAndLoadLyricsModal(title, path);
};
