let str = "the quick brown fox";
let words = str.split(" ");

for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
}

let result = words.join(" ");
console.log(result);