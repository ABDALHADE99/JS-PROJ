function changeColor() {
document.body.style.backgroundColor =
    "rgb(" +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ')';
    document.querySelector('button').style.backgroundColor = "rgb(" +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ')';
}
// Math.random().toFixed(2)
