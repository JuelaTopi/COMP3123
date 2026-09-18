const array = [1, 2, 3, 4];

const calculateSum = array.reduce((total, number) => total + number, 0);
const calculateProduct = array.reduce((total, number) => total * number, 1);

console.log(calculateSum);
console.log(calculateProduct);