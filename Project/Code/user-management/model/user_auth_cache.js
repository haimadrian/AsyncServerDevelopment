class UserAuthCache {
    #cache/*: { [id: string] : string; }*/ = {};

    constructor() {
        this.#cache = {};
    }

    put(jwt, userId)/*: void*/ {
        this.#cache[jwt] = userId;
    }

    get(jwt)/*: string*/ {
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