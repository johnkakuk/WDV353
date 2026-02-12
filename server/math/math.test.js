const { add, subtract, multiply, divide } = require("./math");

describe("Testing the math module", () => {

    /////////
    // ADD //
    /////////

    test("Testing the add function with positive numbers", () => {
        expect(add(2, 3)).toBe(5);
    })

    test("Testing the add function with negative numbers", () => {
        expect(add(-2, -3)).toBe(-5);
    })

    test("Testing the add function with zero", () => {
        expect(add(0, 5)).toBe(5);
    })

    test("Testing the add function with decimal numbers", () => {
        expect(add(2.5, 3.5)).toBe(6);
    })

    test("Testing the add function with mixed numbers", () => {
        expect(add(-2, 3)).toBe(1);
    })

    test("Testing the add function with large numbers", () => {
        expect(add(1e10, 1e10)).toBe(2e10);
    })

    test("Testing the add function with small numbers", () => {
        expect(add(1e-10, 1e-10)).toBe(2e-10);
    })

    test("Testing the add function with mixed types", () => {
        expect(() => add(2, "3")).toThrow(TypeError);
        expect(() => add("2", 3)).toThrow(TypeError);
    })

    test("Testing the add function with the wrong number of arguments", () => {
        expect(() => add(1, 2, 3)).toThrow(TypeError);
        expect(() => add()).toThrow(TypeError);
        expect(() => add(1)).toThrow(TypeError);
    })

    test("Testing the add function with non-numeric inputs", () => {
        expect(() => add({}, 5)).toThrow(TypeError);
        expect(() => add(5, [])).toThrow(TypeError);
    })

    test("Testing the add function with NaN", () => {
        expect(add(NaN, 5)).toBe(NaN);
        expect(add(5, NaN)).toBe(NaN);
    })

    test("Testing the add function with Infinity", () => {
        expect(add(Infinity, 5)).toBe(Infinity);
        expect(add(5, Infinity)).toBe(Infinity);
    })

    test("Testing the add function with -Infinity", () => {
        expect(add(-Infinity, 5)).toBe(-Infinity);
        expect(add(5, -Infinity)).toBe(-Infinity);
    })

    //////////////
    // SUBTRACT //
    //////////////

    test("Testing the subtract function with positive numbers", () => {
        expect(subtract(2, 3)).toBe(-1);
    })

    test("Testing the subtract function with negative numbers", () => {
        expect(subtract(-2, -3)).toBe(1);
    })

    test("Testing the subtract function with zero", () => {
        expect(subtract(0, 5)).toBe(-5);
    })

    test("Testing the subtract function with decimal numbers", () => {
        expect(subtract(2.5, 3.5)).toBe(-1);
    })

    test("Testing the subtract function with mixed numbers", () => {
        expect(subtract(-2, 3)).toBe(-5);
    })

    test("Testing the subtract function with large numbers", () => {
        expect(subtract(1e10, 1e10)).toBe(0);
    })

    test("Testing the subtract function with small numbers", () => {
        expect(subtract(1e-10, 1e-10)).toBe(0);
    })

    test("Testing the subtract function with mixed types", () => {
        expect(() => subtract(2, "3")).toThrow(TypeError);
        expect(() => subtract("2", 3)).toThrow(TypeError);
    })

    test("Testing the subtract function with the wrong number of arguments", () => {
        expect(() => subtract(1, 2, 3)).toThrow(TypeError);
        expect(() => subtract()).toThrow(TypeError);
        expect(() => subtract(1)).toThrow(TypeError);
    })

    test("Testing the subtract function with non-numeric inputs", () => {
        expect(() => subtract({}, 5)).toThrow(TypeError);
        expect(() => subtract(5, [])).toThrow(TypeError);
    })

    test("Testing the subtract function with NaN", () => {
        expect(subtract(NaN, 5)).toBe(NaN);
        expect(subtract(5, NaN)).toBe(NaN);
    })

    test("Testing the subtract function with Infinity", () => {
        expect(subtract(Infinity, 5)).toBe(Infinity);
        expect(subtract(5, Infinity)).toBe(-Infinity);
    })

    test("Testing the subtract function with -Infinity", () => {
        expect(subtract(-Infinity, 5)).toBe(-Infinity);
        expect(subtract(5, -Infinity)).toBe(Infinity);
    })

    //////////////
    // MULTIPLY //
    //////////////

    test("Testing the multiply function with positive numbers", () => {
        expect(multiply(2, 3)).toBe(6);
    })

    test("Testing the multiply function with negative numbers", () => {
        expect(multiply(-2, -3)).toBe(6);
    })

    test("Testing the multiply function with zero", () => {
        expect(multiply(0, 5)).toBe(0);
    })

    test("Testing the multiply function with decimal numbers", () => {
        expect(multiply(2.5, 3.5)).toBe(8.75);
    })

    test("Testing the multiply function with mixed numbers", () => {
        expect(multiply(-2, 3)).toBe(-6);
    })

    test("Testing the multiply function with large numbers", () => {
        expect(multiply(1e10, 1e10)).toBe(1e20);
    })

    test("Testing the multiply function with small numbers", () => {
        expect(multiply(1e-10, 1e-10)).toBeCloseTo(1e-20); // Using toBeCloseTo for very small numbers to avoid precision issues
    })

    test("Testing the multiply function with mixed types", () => {
        expect(() => multiply(2, "3")).toThrow(TypeError);
        expect(() => multiply("2", 3)).toThrow(TypeError);
    })

    test("Testing the multiply function with the wrong number of arguments", () => {
        expect(() => multiply(1, 2, 3)).toThrow(TypeError);
        expect(() => multiply()).toThrow(TypeError);
        expect(() => multiply(1)).toThrow(TypeError);
    })

    test("Testing the multiply function with non-numeric inputs", () => {
        expect(() => multiply({}, 5)).toThrow(TypeError);
        expect(() => multiply(5, [])).toThrow(TypeError);
    })

    test("Testing the multiply function with NaN", () => {
        expect(multiply(NaN, 5)).toBe(NaN);
        expect(multiply(5, NaN)).toBe(NaN);
    })

    test("Testing the multiply function with Infinity", () => {
        expect(multiply(Infinity, 5)).toBe(Infinity);
        expect(multiply(5, Infinity)).toBe(Infinity);
    })

    test("Testing the multiply function with -Infinity", () => {
        expect(multiply(-Infinity, 5)).toBe(-Infinity);
        expect(multiply(5, -Infinity)).toBe(-Infinity);
    })

    ////////////
    // DIVIDE //
    ////////////

    test("Testing the divide function with positive numbers", () => {
        expect(divide(4, 2)).toBe(2);
    })

    test("Testing the divide function with negative numbers", () => {
        expect(divide(-2, -3)).toBe(2/3);
    })

    test("Testing the divide function with zero", () => {
        expect(divide(0, 5)).toBe(0);
    })

    test("Testing the divide function with decimal numbers", () => {
        expect(divide(2.5, 3.5)).toBeCloseTo(2.5/3.5);
    })

    test("Testing the divide function with mixed numbers", () => {
        expect(divide(-2, 3)).toBe(-2/3);
    })

    test("Testing the divide function with large numbers", () => {
        expect(divide(1e10, 1e10)).toBe(1);
    })

    test("Testing the divide function with small numbers", () => {
        expect(divide(1e-10, 1e-10)).toBe(1);
    })

    test("Testing the divide function with mixed types", () => {
        expect(() => divide(2, "3")).toThrow(TypeError);
        expect(() => divide("2", 3)).toThrow(TypeError);
    })

    test("Testing the divide function with the wrong number of arguments", () => {
        expect(() => divide(1, 2, 3)).toThrow(TypeError);
        expect(() => divide()).toThrow(TypeError);
        expect(() => divide(1)).toThrow(TypeError);
    })

    test("Testing the divide function with non-numeric inputs", () => {
        expect(() => divide({}, 5)).toThrow(TypeError);
        expect(() => divide(5, [])).toThrow(TypeError);
    })

    test("Testing the divide function with NaN", () => {
        expect(divide(NaN, 5)).toBe(NaN);
        expect(divide(5, NaN)).toBe(NaN);
    })

    test("Testing the divide function with Infinity", () => {
        expect(divide(Infinity, 5)).toBe(Infinity);
        expect(divide(5, Infinity)).toBe(0);
    })

    test("Testing the divide function with -Infinity", () => {
        expect(divide(-Infinity, 5)).toBe(-Infinity);
        expect(divide(5, -Infinity)).toBe(0 || -0); // Was turning out -0, I didn't even know that was a thing
    })

    //////////
    // SQRT //
    //////////

    test("Testing the Math.sqrt function with a positive number", () => {
        expect(Math.sqrt(4)).toBe(2);
    })

    test("Testing the Math.sqrt function with a negative number", () => {
        expect(Math.sqrt(-2)).toBe(NaN);
    })

    test("Testing the Math.sqrt function with zero", () => {
        expect(Math.sqrt(0)).toBe(0);
    })

    test("Testing the Math.sqrt function with a decimal number", () => {
        expect(Math.sqrt(2.5)).toBeCloseTo(1.5811);
    })

    test("Testing the Math.sqrt function with a large number", () => {
        expect(Math.sqrt(1e10)).toBe(1e5);
    })

    test("Testing the Math.sqrt function with a small number", () => {
        expect(Math.sqrt(1e-10)).toBe(1e-5);
    })

    test("Testing the Math.sqrt function with non-numeric inputs", () => {
        expect(Math.sqrt({})).toBe(NaN);
    })

    test("Testing the Math.sqrt function with NaN", () => {
        expect(Math.sqrt(NaN)).toBe(NaN);
    })

    test("Testing the Math.sqrt function with Infinity", () => {
        expect(Math.sqrt(Infinity)).toBe(Infinity);
    })

    test("Testing the Math.sqrt function with -Infinity", () => {
        expect(Math.sqrt(-Infinity)).toBe(NaN);
    })

    /////////
    // MAX //
    /////////

    test("Testing the Math.max function with positive numbers", () => {
        expect(Math.max(4, 2)).toBe(4);
    })

    test("Testing the Math.max function with negative numbers", () => {
        expect(Math.max(-2, -3)).toBe(-2);
    })

    test("Testing the Math.max function with zero", () => {
        expect(Math.max(0, 5)).toBe(5);
    })

    test("Testing the Math.max function with decimal numbers", () => {
        expect(Math.max(2.5, 3.5)).toBe(3.5);
    })

    test("Testing the Math.max function with mixed numbers", () => {
        expect(Math.max(-2, 3)).toBe(3);
    })

    test("Testing the Math.max function with large numbers", () => {
        expect(Math.max(1e10, 1e15)).toBe(1e15);
    })

    test("Testing the Math.max function with small numbers", () => {
        expect(Math.max(1e-10, 1e-15)).toBe(1e-10);
    })

    test("Testing the Math.max function with mixed types", () => {
        expect(Math.max(2, "3")).toBe(3);
        expect(Math.max("2", 3)).toBe(3); // Strings are coerced to numbers, so this will return 3
    })

    test("Testing the Math.max function with the wrong number of arguments", () => {
        expect(Math.max()).toBe(-Infinity);
    })

    test("Testing the Math.max function with non-numeric inputs", () => {
        expect(Math.max({}, 5)).toBe(NaN);
        expect(Math.max(5, [])).toBe(5); // Arrays are coerced to 0, so this will return 5
    })

    test("Testing the Math.max function with NaN", () => {
        expect(Math.max(NaN, 5)).toBe(NaN);
        expect(Math.max(5, NaN)).toBe(NaN);
    })

    test("Testing the Math.max function with Infinity", () => {
        expect(Math.max(Infinity, 5)).toBe(Infinity);
        expect(Math.max(5, Infinity)).toBe(Infinity);
    })

    test("Testing the Math.max function with -Infinity", () => {
        expect(Math.max(-Infinity, 5)).toBe(5);
        expect(Math.max(5, -Infinity)).toBe(5); // Was turning out -0, I didn't even know that was a thing
    })

})