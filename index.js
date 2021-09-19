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
var metadataList = [];
var attributesList = [];
let dnaList = [];

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `./output/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue},100%,85%)`;
  return pastel;
};
const drawBaground = () => {
  ctx.fillstyle = genColor();
  ctx.fillRect(0, 0, width, length);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: _dna,
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
  };
  metadataList.push(tempMetadata);

  // we clearn the lists
  attributesList = [];
};

const addAtributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    name: selectedElement.name,
    rarity: selectedElement.rarity,
  });
};

const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(
      `${_layer.location}${_layer.selectedElement.fileName}`
    );
    resolve({ layer: _layer, loadedImage: image });
  });
};

const drawElement = (_element) => {
  ctx.drawImage(
    _element.loadedImage,
    _element.layer.position.x,
    _element.layer.position.y,
    _element.layer.size.width,
    _element.layer.size.height
  );

  addAtributes(_element);
};

const constructLayerToDna = (_dna, _layer) => {
  let DnaSegment = _dna.toString().match(/.{1,2}/g);
  console.log(DnaSegment);
  let mappedDnaToLayers = _layer.map((layer) => {
    let selectedElement =
      layer.elements[[parseInt(DnaSegment) % layer.elements.length]];
    return {
      location: layer.location,
      position: layer.position,
      size: layer.size,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
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

const writeMetaData = (_data) => {
  fs.writeFileSync("./output/_metadata.json", _data);
};

const createNFT = async () => {
  writeMetaData("");
  let editionCount = 1;
  while (editionCount <= editionSize) {
    let newDna = createDna(layers.length * 2 - 1);
    console.log(dnaList);
    console.log(`Dna list ${newDna}`);
    if (isDnaUnique(dnaList, newDna)) {
      console.log(`Created ${newDna}`);
      let results = constructLayerToDna(newDna, layers);
      let loadedElemens = []; // promise array
      results.forEach((layer) => {
        loadedElemens.push(loadLayerImg(layer)); // promise
      });

      await Promise.all(loadedElemens).then((elementArray) => {
        elementArray.forEach((element) => {
          drawElement(element);
        });

        saveImage(editionCount);
        addMetadata(newDna, editionCount);
        console.log(`Created edition: ${editionCount} with DNA: ${newDna}`);
      });
      dnaList.push(newDna);
      editionCount++;
    } else {
      console.log("Dna exists");
    }
  }
  writeMetaData(JSON.stringify(metadataList));
};

createNFT();
