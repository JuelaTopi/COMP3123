function max(a, b, c) {
    if (a >= b && a >= c) {
        return a;
    } else if (b >= a && b >= c) {
        return b;
    } else {
        return c;
    }
}

console.log(max(1, 0, 1));       // 1
console.log(max(0, -10, -20));   // 0
console.log(max(1000, 510, 440)); // 1000