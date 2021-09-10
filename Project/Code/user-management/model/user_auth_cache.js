class UserAuthCache {
    #cache/*: { [id: string] : string; }*/ = {};

    constructor() {
        this.#cache = {};
    }

    put(userId, jwt)/*: void*/ {
        this.#cache[userId] = jwt;
    }

    get(userId)/*: string*/ {
        return this.#cache[userId];
    }

    contains(userId)/*: boolean*/ {
        return typeof this.#cache[userId] !== "undefined";
    }
}

const userAuthCache = new UserAuthCache();
module.exports = userAuthCache;