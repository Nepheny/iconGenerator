const { dialog } = require('electron').remote;
const { exec } = require('child_process');
const fs = require('fs');
const filePath = __dirname + '/outputs';
const imgName = '/icon_1024x1024.png';

exec('node generator.js', (err, stdout, stderr) => {
  console.log(err)
  console.log(stdout)
  console.log(stderr)
});

// initialisation des dossiers
// creation des dossiers :
fs.promises.mkdir(filePath+'/android/mipmap-mdpi', { recursive: true }).catch(console.error);
fs.promises.mkdir(filePath+'/android/mipmap-hdpi', { recursive: true }).catch(console.error);
fs.promises.mkdir(filePath+'/android/mipmap-xhdpi', { recursive: true }).catch(console.error);
fs.promises.mkdir(filePath+'/android/mipmap-xxhdpi', { recursive: true }).catch(console.error);
fs.promises.mkdir(filePath+'/android/mipmap-xxxhdpi', { recursive: true }).catch(console.error);
fs.promises.mkdir(filePath+'/ios', { recursive: true }).catch(console.error);

let ctx = null;
let image = null;

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener('DOMContentLoaded', () => {

  // Listen restart button
  document.getElementById('restart-btn') && document.getElementById('restart-btn').addEventListener('click', () => {
    window.location.href = 'index.html'
  });

  const roundedRect = (context, x, y, width, height, radius, fill, stroke) => {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'string') {
      radius = {tl: +radius, tr: +radius, br: +radius, bl: +radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    context.beginPath();
    context.moveTo(x + radius.tl, y);
    context.lineTo(x + width - radius.tr, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    context.lineTo(x + width, y + height - radius.br);
    context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    context.lineTo(x + radius.bl, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    context.lineTo(x, y + radius.tl);
    context.quadraticCurveTo(x, y, x + radius.tl, y);
    context.closePath();
    fill && context.fill();
    stroke && context.stroke();
  }

  const createBgColor = (color) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  const createImage = (zoom, left, top) => {
    let dx = 0;
    let dy = 0;
    let dw = ctx.canvas.width;
    let dh = ctx.canvas.height;

    // Zoom gesture
    zoom && (dw = image.width * zoom);
    zoom && (dh = image.height * zoom);

    // Left and top gesture
    left && (dx = (ctx.canvas.width - dw) * left);
    top && (dy = (ctx.canvas.height - dh) * top);

    // Draw image
    ctx.drawImage(image, dx, dy, dw, dh);
  }

  const createBorder = (border, colorBorder) => {
    let maskCanvas = document.createElement('canvas');
    maskCanvas.width = ctx.canvas.width;
    maskCanvas.height = ctx.canvas.height;
    let maskCtx = maskCanvas.getContext('2d');
    maskCtx.fillStyle = colorBorder;
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.globalCompositeOperation= 'xor';
    roundedRect(maskCtx, 0, 0, maskCanvas.width, maskCanvas.height, border, true, false);
    ctx.drawImage(maskCanvas, 0, 0);
  }

  const reloadCanvas = () => {
    const color = document.getElementById('primary_color').value;
    const colorBorder = document.getElementById('primary_color_border').value;
    const zoom = document.getElementById('zoom').value;
    const left = document.getElementById('left').value;
    const top = document.getElementById('top').value;
    const border = document.getElementById('border').value;
    ctx = document.getElementById('canvas').getContext('2d');

    // Clear gesture
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Background-color gesture
    color && createBgColor(color);

    // Image gesture
    image && createImage(zoom, left, top);

    // Border gesture
    border && colorBorder && createBorder(border, colorBorder);
  }

  // Listen upload-file button
  document.getElementById('upload-file') && document.getElementById('upload-file').addEventListener('click', () => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{
        name: 'Images',
        defaultFolder: filePath,
        extensions: ['jpeg', 'jpg', 'png', 'svg']
      }]
    }).then(result => {
      if (!result.canceled && result.filePaths) {
        const img = new Image();
        img.onload = () => {
          image = img;
          reloadCanvas();
        }
        img.src = result.filePaths;
      }
    }).catch(err => console.log('error', err));
  });

  // Listen to all inputs in interface
  document.querySelectorAll('input').forEach(input => input.addEventListener('input', reloadCanvas));

  // Listen save button
  document.getElementById('save-btn') && document.getElementById('save-btn').addEventListener('click', () => {
    let base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
    fs.writeFile(filePath + imgName, base64Data, 'base64', err => {
      err && console.log(err);
      window.location.href = 'end.html';
    });
  });
});
