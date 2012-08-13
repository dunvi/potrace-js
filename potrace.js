console.log("where's the fire?");

var testImage = document.getElementById('example');
var context = testImage.getContext('2d');

testImage.addEventListener('click', function() {
    
    // once you have an image...
    context.fillStyle = 'red';
    context.fillRect(25, 25, 50, 20);
    context.fillRect(50, 20, 20, 50);
    context.fillRect(25, 55, 50, 20);
    context.fillRect(40, 25, 05, 30);
    
    // you just convert the image to a drafter object...
    testDrafter = Object.create(Drafter);
    testDrafter.init(testImage, 0);
    
    // and then (theoretically) this is all you need to run!
    testPathBuilder = Object.create(PathBuilder).run(testDrafter);
    
    
    
    //// this is just debugging code
    //console.log("All cycles: ");
    console.log(testPathBuilder.allCycles);
    
    var longests = testPathBuilder.straightener.longests;
    console.log(longests);
    
    ////
    
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = testDrafter.width;
    tempCanvas.height = testDrafter.height;
    var tempContext = tempCanvas.getContext('2d')
    
    var mypath, mystart, myend;
    
    for (var j = 0; j < longests.length; j++) {
        
        mypath = testPathBuilder.allCycles[j];
        
        for (var i = 0; i < longests[j].length; i++) {
            mystart = mypath.indexer(i);
            myend = mypath.indexer(longests[j][i]);
            tempContext.strokeStyle = 'rgb(' + i + ',' + '0' + ','
                                      + '0' + ')';
            tempContext.beginPath();
            tempContext.moveTo(mystart.x, mystart.y);
            tempContext.lineTo(myend.x, myend.y);
            tempContext.stroke();
        }
    
    }
    
    document.body.appendChild(tempCanvas);
    
});



