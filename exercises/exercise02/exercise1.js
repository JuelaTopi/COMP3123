// Exercise 1
const greeter = (myArray, counter) => {
  const greetText = "Hello";

  for (let name of myArray) {
    console.log(`${greetText} ${name}`);
  }
};

greeter(["Randy Savage", "Ric Flair", "Hulk Hogan"], 3);