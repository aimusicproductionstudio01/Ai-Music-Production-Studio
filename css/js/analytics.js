/**
 * AI Music Production Studio - SITE METRICS & ANALYTICS ENGINE (analytics.js)
 * Purpose: Manages live site interaction telemetry, page views, local visitor 
 * auditing structures, and anchors Google Analytics hooks.
 */

// Global Configuration Constants
const GOOGLE_ANALYTICS_ID = "G-XXXXXXXXXX"; // Replace with your live measurement ID

document.addEventListener("DOMContentLoaded", () => {
    injectGoogleAnalyticsScript(GOOGLE_ANALYTICS_ID);
    processLocalVisitorTelemetry();
    registerFutureMetricHooks();
});

/**
 * 1. GOOGLE ANALYTICS INTEGRATION
 * Dynamically injects Google Tag Engine scripts into the layout document head.
 * @param {string} trackingId - Your Google Analytics measurement ID
 */
function injectGoogleAnalyticsScript(trackingId) {
    if (trackingId === "G-XXXXXXXXXX") {
        console.info("Analytics Engine: Using placeholder Measurement ID. Update to go live.");
    }

    // Append standard tracking engine tag array scripts onto layout
    const gaScriptNode = document.createElement("script");
    gaScriptNode.async = true;
    gaScriptNode.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(gaScriptNode);

    // Initialize cross-origin event router array parameters
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', trackingId, {
        'cookie_flags': 'SameSite=None;Secure',
        'page_title': document.title,
        'page_path': window.location.pathname
    });

    console.log("Analytics Engine: Google Tag Engine successfully registered.");
}

/**
 * 2. VISITOR COUNTER & PAGE VIEWS REGISTRY
 * Computes individual engagement records using sandboxed browser memory keys.
 */
function processLocalVisitorTelemetry() {
    // Metric 1: Increment Total Site Page Views on every raw initialization layout pass
    let currentTotalPageViews = parseInt(localStorage.getItem("studio_metric_pageviews")) || 0;
    currentTotalPageViews++;
    localStorage.setItem("studio_metric_pageviews", currentTotalPageViews);

    // Metric 2: Calculate Unique Returning Visitors based on a 24-hour expiration token
    let visitorToken = localStorage.getItem("studio_visitor_token");
    let isUniqueNewSession = false;

    if (!visitorToken) {
        // Create an arbitrary session token to identify a fresh browser fingerprint
        visitorToken = "usr_" + Math.random().toString(36).substring(2, 15) + Date.now();
        localStorage.setItem("studio_visitor_token", visitorToken);
        isUniqueNewSession = true;
    }

    let localVisitorCount = parseInt(localStorage.getItem("studio_metric_visitors")) || 0;
    if (isUniqueNewSession && localVisitorCount === 0) {
        localVisitorCount = 1;
        localStorage.setItem("studio_metric_visitors", localVisitorCount);
    } else if (isUniqueNewSession) {
        localVisitorCount++;
        localStorage.setItem("studio_metric_visitors", localVisitorCount);
    }

    // Telemetry Sync: Expose structural counts to UI metrics block channels if available
    renderTelemetryStatsDashboard(localVisitorCount, currentTotalPageViews);
}

/**
 * Pushes updated counter numbers into corresponding textual layout slots.
 * @param {number} visitors - Unique calculated visitor total
 * @param {number} views - Accumulated view index number
 */
function renderTelemetryStatsDashboard(visitors, views) {
    const visitorDisplayNode = document.getElementById("analytics-total-visitors");
    const viewDisplayNode = document.getElementById("analytics-total-views");

    if (visitorDisplayNode) visitorDisplayNode.innerText = Number(visitors).toLocaleString();
    if (viewDisplayNode) viewDisplayNode.innerText = Number(views).toLocaleString();
}

/**
 * 3. FUTURE STATISTICS & CUSTOM INTERACTION LOGGING TRACKERS
 * Event hooks built out to trap conversion matrices (Clicks, Plays, Exports).
 */
function registerFutureMetricHooks() {
    // Hook 1: Track internal track play events triggered via user interface
    window.addEventListener("StudioModulePlayRequest", (event) => {
        const trackMetadata = event.detail;
        logCustomStudioTelemetry("song_playback_started", {
            'song_id': trackMetadata.id,
            'song_title': trackMetadata.title,
            'song_category': trackMetadata.meta
        });
    });

    // Hook 2: Capture file export requests across download vectors
    document.body.addEventListener("click", (event) => {
        const targetBtn = event.target.closest(".protected-download-trigger");
        if (targetBtn) {
            const trackTitle = targetBtn.getAttribute("data-title") || "Unknown Master Asset";
            logCustomStudioTelemetry("track_download_intent", {
                'asset_title': trackTitle,
                'client_status': localStorage.getItem("loggedIn") === "true" ? "authenticated" : "anonymous"
            });
        }
    });
}

/**
 * Global interface utility for logging interactions. 
 * Forwards entries to Google Analytics and caches them for future analytics dashboards.
 * @param {string} customEventName - Telemetry tracking variable label
 * @param {Object} contextPayload - Auxiliary context structural parameter parameters
 */
function logCustomStudioTelemetry(customEventName, contextPayload = {}) {
    // 1. Dispatch directly into standard Google tracking parameters if operational
    if (typeof window.gtag === "function") {
        window.gtag('event', customEventName, contextPayload);
    }

    // 2. Future Statistics Pipeline: Stash logs in a sliding-window array for local reporting layouts
    try {
        let historicalLogBuffer = JSON.parse(localStorage.getItem("studio_telemetry_stream")) || [];
        
        const freshLogEntry = {
            timestamp: new Date().toISOString(),
            event: customEventName,
            data: contextPayload
        };

        historicalLogBuffer.push(freshLogEntry);
        
        // Cap local log historical storage sizes to avoid cluttering local allocations
        if (historicalLogBuffer.length > 100) {
            historicalLogBuffer.shift(); 
        }

        localStorage.setItem("studio_telemetry_stream", JSON.stringify(historicalLogBuffer));
    } catch (error) {
        console.error("Telemetry Stream Write Fault: ", error);
    }
}
