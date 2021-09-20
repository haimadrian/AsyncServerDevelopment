const key = 'ex-user-token';

/**
 * Function to save token to local storage
 */
export function saveToken(userToken) {
    if (userToken.trim() !== '') {
        // Save to local storage so we will be able to skip sign in when
        // reopening the browser, or opening a new tab.
        localStorage.setItem(key, userToken);
    } else {
        localStorage.removeItem(key);
    }
}

/**
 * Function to get token from local storage
 */
export function loadToken() {
    return localStorage.getItem(key)?.trim();
}