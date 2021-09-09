const fs = require("fs");
const {createCanvas, loadImage} = require("canvas")
const console = require("console")
const canvas = createCanvas(1000,1000);
const ctx = canvas.getContext("2d");

const saveLayer = (_canvas)=>{
    fs.writeFileSync("./newImage.png",_canvas.toBuffer("image/png"))
}

const drawLayer = async()=>{
    const image = await loadImage("./mug.png");
    ctx.drawImage(img,0,0,1000,1000)
}

drawLayer()