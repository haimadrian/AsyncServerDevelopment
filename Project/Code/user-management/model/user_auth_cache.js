class UserAuthCache {
    #cache/*: { [id: string] : string; }*/ = {};

    constructor() {
        this.#cache = {};
    }

    static #toKey(userId) {
        return userId.toString().toLowerCase();
    }

    put(userId, jwt)/*: void*/ {
        this.#cache[UserAuthCache.#toKey(userId)] = jwt;
    }

    get(userId)/*: string*/ {
        return this.#cache[UserAuthCache.#toKey(userId)];
    }

    contains(userId)/*: boolean*/ {
        return typeof this.#cache[UserAuthCache.#toKey(userId)] !== "undefined";
    }
}

const userAuthCache = new UserAuthCache();
module.exports = userAuthCache;