function angle_Type(angle) {
    if (angle < 90) {
        return "Acute angle";
    } else if (angle === 90) {
        return "Right angle";
    } else if (angle < 180) {
        return "Obtuse angle";
    } else if (angle === 180) {
        return "Straight angle";
    }
}

console.log(angle_Type(47));
console.log(angle_Type(90));
console.log(angle_Type(145));
console.log(angle_Type(180));