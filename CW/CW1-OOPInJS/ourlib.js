function sum(...args) {
    let s = 0;
    for (let i = 0; i < args.length; i++) {
        s += args[i];
    }
    return s;
}

function sumWithDefaultArgs() {
    let s = 0;
    for (let i = 0; i < arguments.length; i++) {
        s += arguments[i];
    }
    return s;
}