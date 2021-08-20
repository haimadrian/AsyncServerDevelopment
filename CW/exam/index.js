function functionArguments(arg1, arg2) {
    console.log(arg1);
    console.log(arg2);

    console.log(arguments.callee);
    console.log(arguments.length);

    console.log(arguments[0]);
    console.log(arguments[2]);
    console.log(arguments[10]);
}

function forEachProperty() {
    let ob = {};
    ob.id = "123";
    ob.name = "MyName";

    for (let prop in ob) {
        console.log(prop);
    }
}

forEachProperty();