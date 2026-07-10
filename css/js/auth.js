/**
 * AI Music Production Studio - SECURE IDENTITY TERMINAL (auth.js)
 * Purpose: Manages localized security profiles, encrypted states, 
 * persistent session cookies, and resource protection vectors.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Structural Initializer: Runs silent route and access token verification
    evaluateIdentityContext();
    bindAuthenticationUIForms();
});

/**
 * 1. CHECK LOGIN STATE & SESSION INITIALIZATION
 * Audits storage vectors to establish global security contexts across modules.
 */
function evaluateIdentityContext() {
    const persistToken = localStorage.getItem("loggedIn") === "true";
    const ephemeralToken = sessionStorage.getItem("loggedIn") === "true";
    const identityToken = localStorage.getItem("currentUser");

    // Clean up fragmented tokens if a user somehow has a half-baked state
    if ((persistToken || ephemeralToken) && identityToken) {
        window.isClientAuthenticated = true;
        window.authenticatedClientEmail = identityToken;
        console.log(`Identity Sync: Active session verified for user [${identityToken}]`);
    } else {
        window.isClientAuthenticated = false;
        window.authenticatedClientEmail = null;
        clearSecurityTokens();
    }
}

/**
 * 2. SIGNUP ENGINE
 * Compiles unique registration credentials into regional localStorage tables.
 * @param {string} name - Display identity label
 * @param {string} email - Account key token
 * @param {string} password - Raw access text string
 */
function executeClientRegistration(name, email, password) {
    if (!name || !email || !password) return { success: false, msg: "All access parameter forms must be populated." };
    
    const structuredKey = email.trim().toLowerCase();
    
    // Check if the identity node already exists in database records
    if (localStorage.getItem(`user_${structuredKey}`)) {
        return { success: false, msg: "An account with this email address already exists." };
    }

    const secureProfileObject = {
        name: name.trim(),
        email: structuredKey,
        signature: btoa(password), // Base64 encoding simulation layer
        registeredAt: new Date().toISOString()
    };

    localStorage.setItem(`user_${structuredKey}`, JSON.stringify(secureProfileObject));
    return { success: true, msg: "Registration successful! Proceed to login." };
}

/**
 * 3. LOGIN ENGINE
 * Validates criteria structures against existing data partitions.
 * @param {string} email - Search key token
 * @param {string} password - Check match sequence
 * @param {boolean} rememberUser - Activates localized structural persist arrays
 */
function executeClientAuthentication(email, password, rememberUser) {
    const structuredKey = email.trim().toLowerCase();
    const rawUserData = localStorage.getItem(`user_${structuredKey}`);

    if (!rawUserData) {
        return { success: false, msg: "No record found matching those credentials." };
    }

    const unpackedProfile = JSON.parse(rawUserData);
    const parsedSignature = btoa(password);

    if (unpackedProfile.signature !== parsedSignature) {
        return { success: false, msg: "Authentication failure: Password mismatch." };
    }

    // Set persistence arrays matching user tracking specifications
    if (rememberUser) {
        localStorage.setItem("loggedIn", "true");
    } else {
        sessionStorage.setItem("loggedIn", "true");
    }

    localStorage.setItem("currentUser", structuredKey);
    evaluateIdentityContext();

    return { success: true, msg: "Access authorized. Synchronizing dashboard..." };
}

/**
 * 4. LOGOUT ENGINE
 * Structural destruction system that wipes keys clean from system vectors.
 */
function executeClientLogout() {
    clearSecurityTokens();
    console.log("Identity Context Purged. Redirecting client frame to home root...");
    window.location.reload();
}

function clearSecurityTokens() {
    localStorage.removeItem("loggedIn");
    sessionStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    window.isClientAuthenticated = false;
    window.authenticatedClientEmail = null;
}

/**
 * 5. PROTECT DOWNLOADS FRAMEWORK
 * Intercepts explicit high-fidelity audio output transfers unless a valid session exists.
 * @param {Event} event - System click dispatch handle
 * @param {string} assetUrl - Targeted resource location URL
 */
function challengeDownloadPermission(event, assetUrl) {
    if (!window.isClientAuthenticated) {
        if (event) event.preventDefault();
        
        alert("🔒 Production Studio Notice:\nAn active account is required to extract master tracks. Please register or sign in to continue.");
        
        // Custom broadcast trigger if UI panels are present on page layout context
        const authModal = document.getElementById("auth-modal-container");
        if (authModal) {
            authModal.classList.remove("hidden");
        }
        return false;
    }
    
    console.log(`Resource authorization bypass validated. Fetching master asset: ${assetUrl}`);
    return true;
}

/**
 * 6. UI COMPONENT ACTION BINDINGS
 * Links abstract dynamic operations natively into form element configurations.
 */
function bindAuthenticationUIForms() {
    const loginForm = document.getElementById("studio-login-form");
    const signupForm = document.getElementById("studio-signup-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const pass = document.getElementById("login-password").value;
            const remember = document.getElementById("login-remember")?.checked || false;

            const authStatus = executeClientAuthentication(email, pass, remember);
            if (authStatus.success) {
                window.location.reload();
            } else {
                alert(authStatus.msg);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const pass = document.getElementById("signup-password").value;

            const regStatus = executeClientRegistration(name, email, pass);
            alert(regStatus.msg);
            
            if (regStatus.success && typeof toggleAuthPanels === "function") {
                toggleAuthPanels("login"); // Context switch if helper interface layout exists
            }
        });
    }

    // Attach global click event listeners to detect inline download protection intercept flags
    document.body.addEventListener("click", (e) => {
        const secureDownloadBtn = e.target.closest(".protected-download-trigger");
        if (secureDownloadBtn) {
            const fileTarget = secureDownloadBtn.getAttribute("href") || secureDownloadBtn.getAttribute("data-target");
            const accessGranted = challengeDownloadPermission(e, fileTarget);
            
            if (accessGranted && !secureDownloadBtn.getAttribute("href")) {
                window.open(fileTarget, "_blank");
            }
        }
    });
}
