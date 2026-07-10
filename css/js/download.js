/**
 * AI Music Production Studio - DOWNLOAD MANAGEMENT CONTROLLER (download.js)
 * Purpose: Secure handling of master track distributions. 
 * Intercepts file exports to ensure client authentication parameters are satisfied.
 */

document.addEventListener("DOMContentLoaded", () => {
    initializeStudioDownloadEngine();
});

/**
 * Attaches event monitors to capture production resource acquisition requests.
 */
function initializeStudioDownloadEngine() {
    // Intercept clicks on any element carrying the global protection trigger class
    document.body.addEventListener("click", (event) => {
        const downloadTrigger = event.target.closest(".protected-download-trigger");
        
        if (downloadTrigger) {
            event.preventDefault();
            
            // Extract file metadata and routing keys
            const targetAssetUrl = downloadTrigger.getAttribute("href") || downloadTrigger.getAttribute("data-target");
            const trackTitle = downloadTrigger.getAttribute("data-title") || "Studio Composition Master";

            processSecureDownloadRequest(targetAssetUrl, trackTitle);
        }
    });

    console.log("Download Protection Engine: Operational. Guarding master file nodes.");
}

/**
 * Evaluates credentials and decides whether to authorize the file transfer or redirect.
 * @param {string} fileUrl - Absolute or relative route to the audio file target
 * @param {string} fileName - Clean title string for file system saving naming conventions
 */
function processSecureDownloadRequest(fileUrl, fileName) {
    if (!fileUrl) {
        console.warn("Download aborted: Target source URL token is unpopulated.");
        return;
    }

    // Reference the state evaluation parameters established by auth.js
    const userIsAuthenticated = window.isClientAuthenticated === true || localStorage.getItem("loggedIn") === "true" || sessionStorage.getItem("loggedIn") === "true";

    if (userIsAuthenticated) {
        console.log(`Authorization confirmed. Deploying pipeline download array for: ${fileName}`);
        executeSecureFileTransfer(fileUrl, fileName);
    } else {
        console.warn("Authorization rejected: Anonymous client context. Redirecting to login route.");
        handleUnauthorizedRedirect();
    }
}

/**
 * Deploys an on-the-fly anchor element to cleanly force a file attachment download pipeline.
 */
function executeSecureFileTransfer(url, name) {
    const hiddenAnchorNode = document.createElement("a");
    hiddenAnchorNode.href = url;
    
    // Suggests a clean naming layout for the file when saved locally
    hiddenAnchorNode.download = `${name.trim().replace(/\s+/g, "_")}_Master.mp3`;
    hiddenAnchorNode.target = "_blank";
    
    document.body.appendChild(hiddenAnchorNode);
    hiddenAnchorNode.click();
    document.body.removeChild(hiddenAnchorNode);
    
    console.log("Master track download signal successfully dispatched.");
}

/**
 * Handles unauthorized access by alerting the client and sending them directly to the login panel.
 */
function handleUnauthorizedRedirect() {
    alert("🔒 Production Studio Protected Action:\nAn active producer account is required to export high-fidelity master stems. Redirecting to the authentication gateway.");

    // Check if the project is running a single-page layout with modal authentication blocks
    const localAuthPanel = document.getElementById("auth-modal-container");
    
    if (localAuthPanel) {
        localAuthPanel.classList.remove("hidden", "opacity-0");
        // Focus client directly onto the input terminal fields
        const localEmailInput = document.getElementById("login-email");
        if (localEmailInput) localEmailInput.focus();
    } else {
        // Fallback: If your ecosystem utilizes split pages, route them directly to your login file
        window.location.href = "login.html?redirect=downloads";
    }
}
