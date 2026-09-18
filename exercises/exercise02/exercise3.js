const capitalize = (text) => {
  const [first, ...rest] = [...text];
  return first.toUpperCase() + rest.join("").toLowerCase();
};

const colors = ["red", "green", "blue"];

const capitalizedColors = colors.map(color => capitalize(color));

console.log(capitalizedColors);