class UserToken {
    static #key = 'ex-user-token';

    constructor() {
        this.token = '';
    }

    // Function to save token to local storage
    saveToken(userToken) {
        if (userToken !== '') {
            // Save to local storage so we will be able to skip sign in when
            // reopening the browser, or opening a new tab.
            localStorage.setItem(UserToken.#key, userToken);
        } else {
            localStorage.removeItem(UserToken.#key);
        }

        this.token = userToken;
    };

    // Function to get token from local storage
    loadToken() {
        const tokenString = localStorage.getItem(UserToken.#key);

        if (tokenString) {
            try {
                this.token = tokenString;
            } catch (error) {
                console.error(error);
            }
        }

        return this.token;
    };
}

const userToken = new UserToken();
export default userToken;