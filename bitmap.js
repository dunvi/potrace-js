// canvasElement gotten from document.getElementById('example')
// where example is the canvas element

// threshold = float (percentage at which assumed white)
// threshold = 0 means color must be exactly white or it counts as black



// set to self instead of this
Bitmap = {
    
    var self = this;

    init: function (canvasElement, threshold) {
        self.width  = canvasElement.width;
        self.height = canvasElement.height;
        self.flatimagesize = self.width*self.height;
        
        var context = canvasElement.getContext('2d');
        var threshold = threshold || 0;
        var imageData = context.getImageData(0,0,self.width,self.height);
        
        self.image = new Int8Array(self.flatimagesize);
        
        // get greyscale to go away (stick inside a function) later
        for (var i = 0; i < self.flatimagesize; i++) {
            var greyscale = (imageData.data[i*4]
                            +imageData.data[i*4+1]
                            +imageData.data[i*4+2])
                            /(3*255);
            self.image[i] = greyscale <= threshold ? 0 : 1;
        };
    },
    
    writeToCanvas: function() {
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = self.width;
        tempCanvas.height = self.height;
        var tempContext = tempCanvas.getContext('2d');
        var tempPixels = tempContext.createImageData(self.width, self.height);
        for (var i = 0; i < self.flatimagesize; i++) {
            tempPixels.data[i*4]   = 255*(1-self.image[i]);
            tempPixels.data[i*4+1] = 255*(1-self.image[i]);
            tempPixels.data[i*4+2] = 255*(1-self.image[i]);
            tempPixels.data[i*4+3] = 255;
        };
        tempContext.putImageData(tempPixels,0,0);
        return tempCanvas;
    },
    
    indexer: function ( index1, index2 ) {
        if (index2 === undefined) {
            return self.image[index1];
        } else {
            // index1 = x, index2 = y
            return self.image[index2*self.width + index1];
        }
    },
    
    setter: function( value, index1, index2 ) {
        if (index2 === undefined) {
            self.image[index1] = value;
        } else {
            self.image[index2*self.width + index1] = value;
        }
    },
    
    // takes in an index in the flat array
    // returns the x,y coordinates it corresponds to
    /* try the one below instead
    coord: function( index ) {
        
        return {
            x: function () { return index % self.width },
            y: function () { return Math.floor(index/self.width) }
        }
    }, 
    coord: {
        x: function (index) { return index % self.width },
        y: function (index) { return Math.floor( index / self.width ) }
    },*/
    // this one is used like this: bitmap.coord(i).x;
    coord: function( index ) {
        return {
            x: index % self.width,
            y: Math.floor( index / self.width ),
        };
    },
    
    // I don't know if we'll need this
    //slicer: function( index1, index2, index3, index4 ),
    
};


//probably a better way of doing it
Drafter = Object.create(Bitmap, {
    
    findStart: function() {
        for (var i = 0; i < self.flatimagesize; i++) {
            if (self.image[i] === 1) {
                return coord(i);
            }
        }
        return null;
    },
});
