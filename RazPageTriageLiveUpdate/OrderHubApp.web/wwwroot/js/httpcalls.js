// Global HTTP utility wrapper
const HttpClient = {
    /**
     * Sends an asynchronous POST request with JSON payload and auto-injects anti-forgery tokens.
     * @param {string} url - The target endpoint or handler path.
     * @param {object} payload - The JavaScript object containing data to send.
     * @returns {Promise<any>} - The parsed JSON response tracking state.
     */
    async postJson(url, payload) {
        // Automatically hunt for the built-in ASP.NET Core Verification Token in the DOM
        const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
        const tokenValue = tokenInput ? tokenInput.value : "";

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "RequestVerificationToken": tokenValue
            },
            body: JSON.stringify(payload)
        };

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                // Read server error details if available, otherwise fall back to status text
                const errorText = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[HttpClient Error] Failed dispatching request to ${url}:`, error);
            throw error; // Re-throw so the calling script can handle UI errors or loading states
        }
    }
};