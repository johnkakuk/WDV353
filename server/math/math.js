function add(a, b) {
    try {
        if (typeof a !== "number" || typeof b !== "number") {
            throw new TypeError("Both arguments must be numbers");
        }
        if (arguments.length !== 2) {
            throw new TypeError(`Expected 2 arguments but received ${arguments.length}: ${Array.from(arguments).join(", ")}`);
        }
        else {
            return a + b;
        }
    } catch (error) {
        throw error;
    }
}

function subtract(a, b) {
    try {
        if (typeof a !== "number" || typeof b !== "number") {
            throw new TypeError("Both arguments must be numbers");
        }
        if (arguments.length !== 2) {
            throw new TypeError(`Expected 2 arguments but received ${arguments.length}: ${Array.from(arguments).join(", ")}`);
        }
        else {
            return a - b;
        }
    } catch (error) {
        throw error;
    }
}

function multiply(a, b) {
    try {
        if (typeof a !== "number" || typeof b !== "number") {
            throw new TypeError("Both arguments must be numbers");
        }
        if (arguments.length !== 2) {
            throw new TypeError(`Expected 2 arguments but received ${arguments.length}: ${Array.from(arguments).join(", ")}`);
        }
        else {
            return a * b;
        }
    } catch (error) {
        throw error;
    }
}

function divide(a, b) {
    try {
        if (typeof a !== "number" || typeof b !== "number") {
            throw new TypeError("Both arguments must be numbers");
        }
        if (arguments.length !== 2) {
            throw new TypeError(`Expected 2 arguments but received ${arguments.length}: ${Array.from(arguments).join(", ")}`);
        }
        else {
            return a / b;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    add,
    subtract,
    multiply,
    divide
}