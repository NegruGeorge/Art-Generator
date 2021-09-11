const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");
const { layers, width, height } = require("./input/config.js");
const edition = 1;

const saveLayer = (_canvas) => {
  fs.writeFileSync("./newImage.png", _canvas.toBuffer("image/png"));

  console.log("image created");
};

const drawLayer = async (_layers, _edition) => {
  let element =
    _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
  const image = await loadImage("./mug.png");
  ctx.drawImage(image, 0, 0, width, height);
  console.log("ran");
  saveLayer(canvas);
};

for (let i = 1; i <= edition; i++) {
  layers.forEach((layers) => {
    drawLayer();
  });
}
