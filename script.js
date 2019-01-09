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
    document.querySelector('#errors').innerText = 'None';
  } else if (e.target.files[0].size > 2097152) {
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
  createPixelGraph(imageData);
}

function Pixel (r, g, b, a) {
  this.rgba = [r, g, b, a];
  this.adjacent = [];
}

function createPixelGraph(data) {
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

  startSort(pixelGraph, unsortedPixels);
}

function startSort(graph, unsorted) {
  var method = document.querySelector('.active').innerText;
  var startingPixel = unsorted[Math.floor(Math.random() * unsorted.length)];
  var adjacent = [];

  unsorted = unsorted.filter(pixel => pixel !== startingPixel);

  graph[startingPixel].adjacent.forEach(pixel => {
    adjacent.push(pixel);
  });

  console.log(startingPixel);
  console.log(graph[startingPixel].rgba);

  if (method === 'Virus ') {
    virusSort(graph, unsorted, adjacent);
  } else if (method === 'Diamond ') {
    diamondSort(graph, unsorted, adjacent);
  } else {
    bloomSort(graph, unsorted, adjacent);
  }
}

function virusSort(pixelGraph, unsortedPixels, adjacentPixels) {
  
}

function diamondSort(pixelGraph, unsortedPixels, adjacentPixels) {
  var currentPixel = adjacentPixels[0];
  var sumValues = pixelGraph[currentPixel].adjacent.reduce((acc, pixel) => {
    if (!unsortedPixels.includes(pixel)) {
      pixelGraph[pixel].rgba.forEach((value, index) => {
        acc[index] += value;
      });
      acc[4] += 1;
    }
    return acc;
  }, [0, 0, 0, 0, 0]);
  var targetValues = sumValues.reduce((acc, value, index, array) => {
    if (index < 4) {
      acc[index] = Math.floor(value / array[4]);
    }
    return acc;
  }, [0, 0, 0, 0]);

  // find the closest value to that pixels sorted neighbors from all unsorted pixels

  // swap the values of those pixels

  // remove pixel from both unsortedPixels and adjacentPixels array

  // set the new values to the canvas
}

function bloomSort(pixelGraph, unsortedPixels, adjacentPixels) {
  
}

document.querySelector('ul').addEventListener('click', makeActive);
document.querySelector('input').addEventListener('change', setImageToCanvas);