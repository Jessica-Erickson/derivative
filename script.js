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
  if (e.target.files && e.target.files[0]) {
    var newImage = new Image();
    var imageURL = URL.createObjectURL(e.target.files[0]);
    newImage.addEventListener('load', function() {
      updateCanvasWithImage(newImage);
      URL.revokeObjectURL(imageURL);
    }, { once: true });
    newImage.src = imageURL;
  }
}

function updateCanvasWithImage() {

}

document.querySelector('ul').addEventListener('click', makeActive);
document.querySelector('input').addEventListener('change', setImageToCanvas);