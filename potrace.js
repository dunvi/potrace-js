console.log("where's the fire?");

var testImage = document.getElementById('example');
var context = testImage.getContext('2d');

testImage.addEventListener('click', function() {
    context.fillStyle = 'red';
    context.fillRect(25, 25, 50, 50);
    
    testData = new Bitmap(testImage, 0);
    
    console.log(testData.indexer(10));
    console.log(testData.indexer(50,50));
    testData.setter(0,50,50);
    
    document.body.appendChild(testData.writeToCanvas());
    
});



