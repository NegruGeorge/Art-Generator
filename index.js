const fs = require("fs");
const myArgs = process.argv.slice(2);
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");
const { layers, width, height } = require("./input/config.js");
const { resolve } = require("path");

// how many NFT's we will create
const editionSize = myArgs.length > 0 ? Number(myArgs[0]) : 1;
var metadata = [];
var attributes = [];
var hash = [];
var decodedHash = [];
let dnaList = [];

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer("image/png"));
};

const addMetadata = (_edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    hash: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    date: dateTime,
    attributes: attributes,
  };
  metadata.push(tempMetadata);
  // we clearn the lists
  attributes = [];
  hash = [];
  decodedHash = [];
};

const addAtributes = (_element, _layer) => {
  let tempAttr = {
    id: _element.id,
    layer: _layer.name,
    name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({ [_layer.id]: _element.id });
};

const loadLayerImg = async (_layer) => {
  return new Promise(async(resolve)=>{
    
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    resolve({layer:_layer,loadedImage:image})
  });
};

const drawElement = (_element) => {

  ctx.drawImage(
    image,
    _layer.position.x,
    _layer.position.y,
    _layer.size.width,
    _layer.size.height
  );
  addAtributes(_element);
};

const isDnaUnique = (_DnaList = [], _dna) => {
  let foundDna = _DnaList.find((i) => i === _dna);
  return foundDna == undefined ? true : false;
};

const createDna = (_len) => {
  // we need the _len for lauyers => layers = _len
  let randNum = Math.floor(
    Number(`1e${_len}`) + Math.random() * Number(`9e${_len}`)
  );
  return randNum;
};

const writeMetaData = () => {
  fs.writeFileSync("./output/_metadata.json", JSON.stringify(metadata));
};

const createNFT = () => {
  let eCount = 1;
  while (eCount <= editionSize) {
    let newDna = createDna(layers.length * 2 - 1);
    console.log(dnaList);
    console.log(`Dna list ${newDna}`);
    if (isDnaUnique(dnaList, newDna)) {
      console.log(`Created ${newDna}`);

      // layers.forEach((layer) => {
      //   drawLayer(layer, i);
      // });
      // addMetadata(i);
      // console.log(`created editionSize` + i);
      dnaList.push(newDna);
      eCount++;
    } else {
      console.log("Dna exists");
    }
  }
};

createNFT();
writeMetaData();
