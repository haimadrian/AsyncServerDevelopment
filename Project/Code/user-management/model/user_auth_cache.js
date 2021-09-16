class UserAuthCache {
    #cache/*: { [id: string] : [uid: string, email: string]; }*/ = {};

    constructor() {
        this.#cache = {};
    }

    put(jwt, userData)/*: void*/ {
        this.#cache[jwt] = userData;
    }

    get(jwt)/*: {string, string}*/ {
        return this.#cache[jwt];
    }

    contains(jwt)/*: boolean*/ {
        return this.#cache[jwt] !== undefined;
    }

    remove(jwt)/*: void*/ {
        this.#cache[jwt] = undefined;
    }
}

const userAuthCache = new UserAuthCache();
module.exports = userAuthCache;