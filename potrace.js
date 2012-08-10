console.log("where's the fire?");

var testImage = document.getElementById('example');
var context = testImage.getContext('2d');

testImage.addEventListener('click', function() {
    
    
    context.fillStyle = 'red';
    context.fillRect(25, 25, 50, 20);
    context.fillRect(50, 20, 25, 50);
    context.fillRect(25, 55, 50, 20);
    
    testDrafter = Object.create(Drafter);
    testDrafter.init(testImage, 0);
    
    testPathBuilder = Object.create(PathBuilder);
    testPathBuilder.init(testDrafter)
    
    //testPathBuilder.create();
    //console.log("All cycles: ");
    //console.log(testPathBuilder.allCycles);
    
    
    testPathBuilder.createAll();
    
    //document.body.appendChild(testDrafter.writePathToCanvas(testPathBuilder.allCycles[0]));
    
    console.log(testPathBuilder.allCycles);
    
});



