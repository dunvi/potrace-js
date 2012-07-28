console.log("where's the fire?");

var testImage = document.getElementById('example');
var context = testImage.getContext('2d');

testImage.addEventListener('click', function() {
    context.fillStyle = 'red';
    context.fillRect(10, 10, 15, 15);
});

var testData = context.getImageData(0,0,testImage.width,testImage.height);


