var socket = io();
var input = document.getElementById('userImage');
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');

socket.on('connect', () => {
  console.log('ready');
});

socket.on('received', (received) => {
  console.log(received);
});

input.addEventListener('change', setImageToCanvas);

function setImageToCanvas (event) {
  if (event.target.files && event.target.files[0]) {
    var imageUrl = URL.createObjectURL(event.target.files[0]);
    var newImage = new Image();
    newImage.addEventListener('load', () => {
      updateCanvasWithImage(newImage);
    });
    newImage.src = imageUrl;
  }
}

function updateCanvasWithImage (newImage) {
  setCanvasDimensions(newImage);
  ctx.drawImage(newImage,0,0);
  getNewImageData(newImage);
  newImage.removeEventListener('load', () => {
    updateCanvasWithImage(newImage);
  });
}

function setCanvasDimensions (newImage) {
  canvas.height = newImage.height;
  canvas.width = newImage.width;
}

function getNewImageData (newImage) {
  var newImageData = ctx.getImageData(0,0,newImage.width,newImage.height);
  socket.send({ 
    data: newImageData.data, 
    height: newImageData.height, 
    width: newImageData.width
  });
}
