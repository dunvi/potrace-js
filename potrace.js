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
    
    var longestsComplex = testPathBuilder.straightenerComplex.longests;
    var longestsNaive = testPathBuilder.straightenerNaive.longests;
    console.log(longestsComplex);
    console.log(longestsNaive);
    
    ////
    
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = testDrafter.width;
    tempCanvas.height = testDrafter.height;
    var tempContext = tempCanvas.getContext('2d')
    
    var mypath, mystart, myend;
    
    for (var j = 0; j < longestsComplex.length; j++) {
        
        mypath = testPathBuilder.allCycles[j];
        
        for (var i = 0; i < longestsComplex[j].length; i++) {
            mystart = mypath.indexer(i);
            myend = mypath.indexer(longestsComplex[j][i]);
            tempContext.strokeStyle = 'rgb(' + i + ',' + '0' + ','
                                      + '0' + ')';
            tempContext.beginPath();
            tempContext.moveTo(mystart.x, mystart.y);
            tempContext.lineTo(myend.x, myend.y);
            tempContext.stroke();
        }
    
    }
    
    document.body.appendChild(tempCanvas);
    
    var tempCanvas2 = document.createElement('canvas');
    tempCanvas2.width = testDrafter.width;
    tempCanvas2.height = testDrafter.height;
    var tempContext2 = tempCanvas2.getContext('2d')
    
    
    for (var j = 0; j < longestsNaive.length; j++) {
        
        mypath = testPathBuilder.allCycles[j];
        
        for (var i = 0; i < longestsNaive[j].length; i++) {
            mystart = mypath.indexer(i);
            myend = mypath.indexer(longestsNaive[j][i]);
            tempContext2.strokeStyle = 'rgb(' + i + ',' + '0' + ','
                                       + '0' + ')';
            tempContext2.beginPath();
            tempContext2.moveTo(mystart.x, mystart.y);
            tempContext2.lineTo(myend.x, myend.y);
            tempContext2.stroke();
        }
    
    }
    
    document.body.appendChild(tempCanvas2);
    
});



