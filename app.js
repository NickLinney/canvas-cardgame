// Get the canvas element from the DOM
const canvas = document.getElementById('canvas');

// Get the 2D context for the canvas
const context = canvas.getContext('2d');

// Set the initial fill color for the canvas
context.fillStyle = 'white';

// Clear the canvas to the initial fill color
context.fillRect(0, 0, canvas.width, canvas.height);

// Define a function to draw a circle on the canvas
function drawCircle(x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
}

// Define a function to draw a rectangle-shaped image on the canvas
function drawImage(src, x, y) {
  const image = new Image();
  image.onload = function() {
    context.drawImage(image, x, y);
  }
  image.src = src;
}

// Define a class for image rectangles
class ImageRectangle {
  constructor(src, x, y, state) {
    this.src = src;
    this.x = x;
    this.y = y;
    this.width = 188;
    this.height = 263;
    this.state = state || 'untapped';
  }

  draw() {
    drawImage(this.src, this.x, this.y);
  }

  rotateClockwise() {
    if (this.state === 'untapped') {
      context.translate(this.x + this.width/2, this.y + this.height/2);
      context.rotate(Math.PI/2);
      context.translate(-(this.x + this.width/2), -(this.y + this.height/2));
      this.state = 'tapped';
    }
  }

  rotateCounterClockwise() {
    if (this.state === 'tapped') {
      context.translate(this.x + this.width/2, this.y + this.height/2);
      context.rotate(-Math.PI/2);
      context.translate(-(this.x + this.width/2), -(this.y + this.height/2));
      this.state = 'untapped';
    }
  }

  isTapped() {
    return this.state === 'tapped';
  }

  isUntapped() {
    return this.state === 'untapped';
  }

  isInside(x, y) {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }
}

// Create an instance of the ImageRectangle class
const imageRectangle = new ImageRectangle('image.jpg', 306, 168, 'untapped');

// Call the drawCircle function to draw a red circle on the canvas
// drawCircle(canvas.width/2, canvas.height/2, 50, 'red');

// Call the draw method of the imageRectangle instance to draw it on the canvas
imageRectangle.draw();

// Define a function to handle dragging of the image on the canvas
function dragImage() {
  let isDragging = false;
  let offsetX, offsetY;

  canvas.addEventListener('mousedown', function(event) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    if (imageRectangle.isInside(mouseX, mouseY)) {
      isDragging = true;
      offsetX = mouseX - imageRectangle.x;
      offsetY = mouseY - imageRectangle.y;
    }
  });

  canvas.addEventListener('mousemove', function(event) {
    if (isDragging) {
      const mouseX = event.clientX - canvas.offsetLeft;
      const mouseY = event.clientY - canvas.offsetTop;

      context.clearRect(imageRectangle.x, imageRectangle.y, imageRectangle.width, imageRectangle.height);

      imageRectangle.x = mouseX - offsetX;
      imageRectangle.y = mouseY - offsetY;

      imageRectangle.draw();
    }
  });

  canvas.addEventListener('mouseup', function(event) {
    isDragging = false;
  });
}

// Call the dragImage function to enable dragging of the image on the canvas
dragImage();

// Add event listener for double-clicks on the canvas
canvas.addEventListener('dblclick', function(event) {
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;

  if (imageRectangle.isInside(mouseX, mouseY)) {
    if (imageRectangle.isUntapped()) {
      imageRectangle.rotateClockwise();
    } else if (imageRectangle.isTapped()) {
      imageRectangle.rotateCounterClockwise();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    imageRectangle.draw();
  }
});
