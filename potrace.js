console.log("where's the fire?");

var testImage = document.getElementById('example');
var context = testImage.getContext('2d');

testImage.addEventListener('click', function() {
    
    
    context.fillStyle = 'red';
    context.fillRect(25, 25, 50, 20);
    context.fillRect(50, 20, 20, 50);
    context.fillRect(25, 55, 50, 20);
    context.fillRect(40, 25, 05, 30);
    
    testDrafter = Object.create(Drafter);
    testDrafter.init(testImage, 0);
    
    testPathBuilder = Object.create(PathBuilder);
    testPathBuilder.init(testDrafter)
    
    testPathBuilder.createAll();
    
    //console.log("All cycles: ");
    console.log(testPathBuilder.allCycles);
    
    var mypath = testPathBuilder.allCycles[0];
    
    testStraightener = Object.create(Straightener);
    testStraightener.init(mypath);
    testStraightener.findStraights();
    
    var longests = testStraightener.longest;
    console.log(longests);
    
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = testDrafter.width;
    tempCanvas.height = testDrafter.height;
    var tempContext = tempCanvas.getContext('2d')
    
    var mystart, myend;
    for (var i = 0; i < longests.length; i++) {
        mystart = mypath.indexer(i);
        myend = mypath.indexer(longests[i]);
        tempContext.beginPath();
        tempContext.moveTo(mystart.x, mystart.y);
        tempContext.lineTo(myend.x, myend.y);
        tempContext.stroke();
    }
    document.body.appendChild(tempCanvas);
    
});



