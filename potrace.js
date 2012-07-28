console.log("where's the fire?");

var testImage = document.getElementById('example');
var context = testImage.getContext('2d');

testImage.addEventListener('click', function() {
    context.fillStyle = 'red';
    context.fillRect(2, 2, 5, 5);
    
    testData = new Bitmap(testImage, 0);
    document.body.appendChild(testData.writeToCanvas());

});



