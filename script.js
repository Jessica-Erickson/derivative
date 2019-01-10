function makeActive(e) {
  if (e.target.classList.contains('sort-method')) {
    document.querySelectorAll('li').forEach(function(option) {
      option.classList.remove('active');
    });
    e.target.classList.add('active');
  } else if (e.target.classList.contains('sort-img')) {
    document.querySelectorAll('li').forEach(function(option) {
      option.classList.remove('active');
    });
    e.target.parentElement.classList.add('active');
  }
}

function setImageToCanvas(e) {
  if (e.target.files && e.target.files[0] && e.target.files[0].size < 2097152) {
    var newImage = new Image();
    var imageURL = URL.createObjectURL(e.target.files[0]);
    newImage.addEventListener('load', function() {
      updateCanvasWithImage(newImage);
      URL.revokeObjectURL(imageURL);
    }, { once: true });
    newImage.src = imageURL;
    document.querySelector('#errors').innerText = 'Please wait while your picture is sorted. This may take a while. Refresh the page to start over.';
    document.querySelector('input').disabled = true;
  } else if (e.target.files[0] && e.target.files[0].size > 2097152) {
    document.querySelector('#errors').innerText = 'Please select a smaller image to sort.';
  } 
}

function updateCanvasWithImage(image) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.height = image.height;
  canvas.width = image.width;
  ctx.drawImage(image, 0, 0);

  var imageData = ctx.getImageData(0,0, image.width, image.height);
  createPixelGraph(imageData, ctx);
}

function Pixel (r, g, b, a) {
  this.rgba = [r, g, b, a];
  this.adjacent = [];
  this.isSorted = false;
}

function createPixelGraph(data, context) {
  var pixelGraph = {};
  var unsortedPixels = [];
  var imageData = data.data;
  var height = data.height;
  var width = data.width;

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

  startSort(pixelGraph, unsortedPixels, context);
}

function startSort(graph, unsorted, ctx) {
  var method = document.querySelector('.active').innerText;
  var startingPixel = unsorted[Math.floor(Math.random() * unsorted.length)];
  var adjacent = [];

  unsorted = unsorted.filter(pixel => pixel !== startingPixel);

  graph[startingPixel].adjacent.forEach(pixel => {
    adjacent.push(pixel);
  });

  graph[startingPixel].isSorted = true;

  if (method === 'Virus ') {
    virusSort(graph, unsorted, adjacent, ctx);
  } else if (method === 'Diamond ') {
    diamondSort(graph, unsorted, adjacent, ctx);
  } else {
    bloomSort(graph, unsorted, adjacent, ctx);
  }
}

function virusSort(pixelGraph, unsortedPixels, adjacentPixels, context, bufferPixels) {
  var buffer = [];

  if (!bufferPixels) {
    populateBufferPixels(buffer, unsortedPixels);
  } else {
    buffer = bufferPixels;
  }

  populateBufferPixels(buffer, unsortedPixels);


  var currentPixel = adjacentPixels[Math.floor(Math.random() * adjacentPixels.length)];

  pixelGraph[currentPixel].isSorted = true;
  buffer = buffer.filter(pixel => pixel !== currentPixel);
  unsortedPixels = unsortedPixels.filter(pixel => pixel !== currentPixel);
  adjacentPixels = adjacentPixels.filter(pixel => pixel !== currentPixel);
  pixelGraph[currentPixel].adjacent.forEach(pixel => {
    if (!pixelGraph[pixel].isSorted) {
      adjacentPixels.push(pixel);
    }
  });
  
  if (buffer.length === 0) {
    enableInput();
    return;
  }

  var sumValues = getSumValues(pixelGraph, currentPixel);

  var targetValues = getTargetValues(sumValues);

  var closest = getClosest(buffer, pixelGraph, targetValues);

  swapPixels(currentPixel, closest, pixelGraph, context);

  window.requestAnimationFrame(function() {
    virusSort(pixelGraph, unsortedPixels, adjacentPixels, context, buffer);
  });
}

function diamondSort(pixelGraph, unsortedPixels, adjacentPixels, context) {
  if (unsortedPixels.length === 1) {
    enableInput();
    return;
  }

  var currentPixel = adjacentPixels[0];

  pixelGraph[currentPixel].isSorted = true;
  unsortedPixels = unsortedPixels.filter(pixel => pixel !== currentPixel);
  adjacentPixels = adjacentPixels.filter(pixel => pixel !== currentPixel);
  pixelGraph[currentPixel].adjacent.forEach(pixel => {
    if (!pixelGraph[pixel].isSorted) {
      adjacentPixels.push(pixel);
    }
  });

  var sumValues = getSumValues(pixelGraph, currentPixel);

  var targetValues = getTargetValues(sumValues);

  var closest = getClosest(unsortedPixels, pixelGraph, targetValues);

  swapPixels(currentPixel, closest, pixelGraph, context);

  window.requestAnimationFrame(function() {
    diamondSort(pixelGraph, unsortedPixels, adjacentPixels, context);
  });
}

function bloomSort(pixelGraph, unsorted, adjacentPixels, context) {
  if (unsortedPixels.length === 1) {
    enableInput();
    return;
  }
}

function enableInput() {
  document.querySelector('input').disabled = false;
  document.querySelector('#errors').innerText = 'Done! Feel free to select another image to sort.';
}

function populateBufferPixels(buffer, unsortedPixels) {
  while (buffer.length < 1000 && unsortedPixels.length) {
    var randomPix = unsortedPixels[Math.floor(Math.random() * unsortedPixels.length)];
    unsortedPixels = unsortedPixels.filter(pixel => pixel !== randomPix);
    buffer.push(randomPix);
  }
}

function getSumValues(pixelGraph, currentPixel) {
  return pixelGraph[currentPixel].adjacent.reduce((acc, pixel) => {
    if (pixelGraph[pixel].isSorted) {
      pixelGraph[pixel].rgba.forEach((value, index) => {
        acc[index] += value;
      });
      acc[4] += 1;
    }
    return acc;
  }, [0, 0, 0, 0, 0]);
}

function getTargetValues(sumValues) {
  return sumValues.reduce((acc, value, index, array) => {
    if (index < 4) {
      acc[index] = Math.floor(value / array[4]);
    }
    return acc;
  }, [0, 0, 0, 0]);
}

function getClosest(unsortedPixels, pixelGraph, targetValues) {
  return unsortedPixels.reduce((acc, coords) => {
    if (acc !== '') {
      var lastDiff = pixelGraph[acc].rgba.reduce((acc, value, index) => {
        return acc += Math.abs(value - targetValues[index]);
      }, 0);

      var currentDiff = pixelGraph[coords].rgba.reduce((acc, value, index) => {
        return acc += Math.abs(value - targetValues[index]);
      }, 0);
    } else {
      acc = coords;
    }

    if (currentDiff < lastDiff) {
      acc = coords;
    }
    return acc;
  }, '');
}

function swapPixels(currentPixel, closest, pixelGraph, context) {
  var currentPixelValues = pixelGraph[currentPixel].rgba;
  var swapPixelValues = pixelGraph[closest].rgba;
  var currentCoordinates = currentPixel.split('-');
  var swapCoordinates = closest.split('-');
  var current = context.createImageData(1, 1);
  var swap = context.createImageData(1, 1);

  for (var i = 0; i < 4; i++) {
    current.data[i] = currentPixelValues[i];
    swap.data[i] = swapPixelValues[i];
  }

  context.putImageData(current, swapCoordinates[0], swapCoordinates[1]);
  context.putImageData(swap, currentCoordinates[0], currentCoordinates[1]);

  pixelGraph[currentPixel].rgba = swapPixelValues;
  pixelGraph[closest].rgba = currentPixelValues;
}

document.querySelector('ul').addEventListener('click', makeActive);
document.querySelector('input').addEventListener('change', setImageToCanvas);