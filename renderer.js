// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const colorBtn = document.getElementById("primary_color");
const colorDiv = document.getElementById("color_val");
const borderBtn = document.getElementById("primary_color_border");
const borderDiv = document.getElementById("color_val_border");

colorBtn.onchange = () => {
    colorDiv.innerHTML = colorBtn.value;
}

borderBtn.onchange = () => {
    borderDiv.innerHTML = borderBtn.value;
}
