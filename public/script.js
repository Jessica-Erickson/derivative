var input = document.getElementById('userImage');
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');
var newImage = new Image();
var newImageData = {};
var pixelGraph = {};
var unsortedPixels = [];
var bufferPixels = [];
var sortedPixels = [];
var adjacentPixels = [];

input.addEventListener('change', setImageToCanvas);

function setImageToCanvas (event) {
  if (event.target.files && event.target.files[0]) {
    resetPixelGraph();
    resetPixelArrays();
    var imageURL = URL.createObjectURL(event.target.files[0]);
    newImage.addEventListener('load', updateCanvasWithImage);
    newImage.src = imageURL;
  }
}

function resetPixelGraph () {
  pixelGraph = {};
}

function resetPixelArrays () {
  unsortedPixels = [];
  bufferPixels = [];
  sortedPixels = [];
  adjacentPixels = [];
}

function updateCanvasWithImage () {
  setCanvasDimensions();
  ctx.drawImage(newImage,0,0);
  getNewImageData();
  createPixelGraph();
  getStartingPixel();
  populateBufferPixels();
  newImage.removeEventListener('load', updateCanvasWithImage);
  resetNewImage();
  resetNewImageData();
  window.requestAnimationFrame(swapPixels);
}

function swapPixels () {
  if (adjacentPixels.length > 0 && bufferPixels.length > 0) {
    var selected = adjacentPixels[Math.floor(Math.random() * adjacentPixels.length)];
    var processedAdjacents = pixelGraph[selected].adjacent.filter(function (neighbor) {
      return sortedPixels.includes(neighbor);
    });
    var valueToCompare = processedAdjacents.reduce(function (acc, pixel) {
      pixelGraph[pixel].rgba.forEach(function (num) {
        acc += (num / (processedAdjacents.length * 4));
      });
      return acc;
    }, 0);

    var closestValue = '';
    bufferPixels.forEach(function (pixel) {
      if (closestValue === '') {
        closestValue = pixel;
      }
      var existingValue = pixelGraph[closestValue].rgba.reduce(function (acc, num) {
        return acc += (num / 4);
      },0);
      var newValue = pixelGraph[pixel].rgba.reduce(function (acc, num) {
        return acc += (num / 4);
      },0);
      if (Math.abs(valueToCompare - existingValue) > Math.abs(valueToCompare - newValue)) {
        closestValue = pixel;
      }
    });

    var bufferColors = pixelGraph[selected].rgba;
    pixelGraph[selected].rgba = pixelGraph[closestValue].rgba;
    pixelGraph[closestValue].rgba = bufferColors;

    var selectedCoordinates = selected.split('-');
    var bufferCoordinates = closestValue.split('-');
    var cSelected = ctx.createImageData(1, 1);
    var cBuffer = ctx.createImageData(1, 1);

    cSelected.data[0] = pixelGraph[closestValue].rgba[0];
    cSelected.data[1] = pixelGraph[closestValue].rgba[1];
    cSelected.data[2] = pixelGraph[closestValue].rgba[2];
    cSelected.data[3] = pixelGraph[closestValue].rgba[3];
    ctx.putImageData(cSelected, bufferCoordinates[0], bufferCoordinates[1]);

    cBuffer.data[0] = pixelGraph[selected].rgba[0];
    cBuffer.data[1] = pixelGraph[selected].rgba[1];
    cBuffer.data[2] = pixelGraph[selected].rgba[2];
    cBuffer.data[3] = pixelGraph[selected].rgba[3];
    ctx.putImageData(cBuffer, selectedCoordinates[0], selectedCoordinates[1]);

    adjacentPixels = adjacentPixels.filter(function (pixel) {
      return pixel !== selected;
    });
    sortedPixels.push(selected);

    pixelGraph[selected].adjacent.forEach(function (pixel) {
      if (!sortedPixels.includes(pixel) && !adjacentPixels.includes(pixel)) {
        adjacentPixels.push(pixel);
      }
      if (bufferPixels.includes(pixel)) {
        bufferPixels = bufferPixels.filter(function (coordinates) {
          return coordinates !== pixel;
        });
        if (unsortedPixels.length > 0) {
          var newPixel = unsortedPixels[Math.floor(Math.random() * unsortedPixels.length)]
          bufferPixels.push(newPixel);
          unsortedPixels = unsortedPixels.filter(function (string) {
            return string !== newPixel;
          });
        }
      }
      if (unsortedPixels.includes(pixel)) {
        unsortedPixels = unsortedPixels.filter(function (coordinates) {
          return coordinates !== pixel;
        });
      }
    });
  } else if (adjacentPixels.length > 1) {
    var selected = adjacentPixels[Math.floor(Math.random() * adjacentPixels.length)];
    var processedAdjacents = pixelGraph[selected].adjacent.filter(function (neighbor) {
      return sortedPixels.includes(neighbor);
    });
    var valueToCompare = processedAdjacents.reduce(function (acc, pixel) {
      pixelGraph[pixel].rgba.forEach(function (num) {
        acc += (num / (processedAdjacents.length * 4));
      });
      return acc;
    }, 0);

    adjacentPixels = adjacentPixels.filter(function (pixel) {
      return pixel !== selected;
    });
    sortedPixels.push(selected);

    var closestValue = '';
    adjacentPixels.forEach(function (pixel) {
      if (closestValue === '') {
        closestValue = pixel;
      }
      var existingValue = pixelGraph[closestValue].rgba.reduce(function (acc, num) {
        return acc += (num / 4);
      },0);
      var newValue = pixelGraph[pixel].rgba.reduce(function (acc, num) {
        return acc += (num / 4);
      },0);
      if (Math.abs(valueToCompare - existingValue) > Math.abs(valueToCompare - newValue)) {
        closestValue = pixel;
      }
    });

    var bufferColors = pixelGraph[selected].rgba;
    pixelGraph[selected].rgba = pixelGraph[closestValue].rgba;
    pixelGraph[closestValue].rgba = bufferColors;

    var selectedCoordinates = selected.split('-');
    var bufferCoordinates = closestValue.split('-');
    var cSelected = ctx.createImageData(1, 1);
    var cBuffer = ctx.createImageData(1, 1);

    cSelected.data[0] = pixelGraph[closestValue].rgba[0];
    cSelected.data[1] = pixelGraph[closestValue].rgba[1];
    cSelected.data[2] = pixelGraph[closestValue].rgba[2];
    cSelected.data[3] = pixelGraph[closestValue].rgba[3];
    ctx.putImageData(cSelected, bufferCoordinates[0], bufferCoordinates[1]);

    cBuffer.data[0] = pixelGraph[selected].rgba[0];
    cBuffer.data[1] = pixelGraph[selected].rgba[1];
    cBuffer.data[2] = pixelGraph[selected].rgba[2];
    cBuffer.data[3] = pixelGraph[selected].rgba[3];
    ctx.putImageData(cBuffer, selectedCoordinates[0], selectedCoordinates[1]);

    pixelGraph[selected].adjacent.forEach(function (pixel) {
      if (!sortedPixels.includes(pixel) && !adjacentPixels.includes(pixel)) {
        adjacentPixels.push(pixel);
      }
    });
  } else {
    console.log('done!');
    return;
  }
  window.requestAnimationFrame(swapPixels);
}

function setCanvasDimensions () {
  canvas.height = newImage.height;
  canvas.width = newImage.width;
}

function getNewImageData () {
  newImageData = ctx.getImageData(0,0,newImage.width,newImage.height);
}

function createPixelGraph () {
  var imageData = newImageData.data;
  var height = newImageData.height;
  var width = newImageData.width;
  for (var i = 0; i < imageData.length; i += 4) {
    var x = ((i / 4) % width);
    var y = Math.floor((i / 4) / width);
    var coordinates = x + '-' + y;
    var top = x + '-' + (y - 1);
    var right = (x + 1) + '-' + y;
    var bottom = x + '-' + (y + 1);
    var left = (x - 1) + '-' + y;
    pixelGraph[coordinates] = new Pixel(
      imageData[i], 
      imageData[i + 1], 
      imageData[i + 2], 
      imageData[i + 3]
    );
    if ((y - 1) >= 0) {
      pixelGraph[coordinates].adjacent.push(top);
    }
    if ((x + 1) < width) {
      pixelGraph[coordinates].adjacent.push(right);
    }
    if ((y + 1) < height) {
      pixelGraph[coordinates].adjacent.push(bottom);
    }
    if ((x - 1) >= 0) {
      pixelGraph[coordinates].adjacent.push(left);
    }
    unsortedPixels.push(coordinates);
  }
}

function resetNewImage () {
  newImage = new Image();
}

function resetNewImageData () {
  newImageData = {};
}

function Pixel (r, g, b, a) {
  this.rgba = [r,g,b,a];
  this.adjacent = [];
}

function getStartingPixel () {
  var startingPixel = unsortedPixels[Math.floor(Math.random() * unsortedPixels.length)];
  sortedPixels.push(startingPixel);
  unsortedPixels = unsortedPixels.filter(function (coordinate) {
    return coordinate !== startingPixel;
  });
  pixelGraph[startingPixel].adjacent.forEach(function (raddish) {
    adjacentPixels.push(raddish);
    unsortedPixels = unsortedPixels.filter(function (turnip) {
      return turnip !== raddish;
    });
  });
}

function populateBufferPixels () {
  while (bufferPixels.length < 1000) {
    var pixel = unsortedPixels[Math.floor(Math.random() * unsortedPixels.length)];
    unsortedPixels = unsortedPixels.filter(function (coordinate) {
      return coordinate !== pixel;
    });
    if (!sortedPixels.includes(pixel) && !adjacentPixels.includes(pixel)) {
      bufferPixels.push(pixel);
    }
  }
}