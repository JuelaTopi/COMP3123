function right(str) {
    if (str.length < 3) {
        return str;
    }

    let lastThree = str.slice(-3);
    let rest = str.slice(0, -3);

    return lastThree + rest;
}

console.log(right("Python"));
console.log(right("JavaScript"));
console.log(right("Hi"));