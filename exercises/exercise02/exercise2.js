const capitalize = (text) => {
  const [first, ...rest] = [...text];
  return first.toUpperCase() + rest.join("").toLowerCase();
};

console.log(capitalize("fooBar"));
console.log(capitalize("nodeJs"));