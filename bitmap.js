// canvasElement gotten from document.getElementById('example')
// where example is the canvas element

// threshold = float (percentage at which assumed white)
// threshold = 0 means color must be exactly white or it counts as black

Bitmap = {
    
    width: undefined,
    height: undefined,
    flatimagesize: undefined,
    image: undefined,
    
    init: function (canvasElement, threshold) {
        var self = this;
        
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
        
        return self;
    },
    
    writeToCanvas: function() {
        var self = this;
        
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
        }
        tempContext.putImageData(tempPixels,0,0);
        return tempCanvas;
    },

    // given x, y coordinates, what is the value?
    indexer: function ( index1, index2 ) {
        var self = this;
        
        if (index2 === undefined) { // coordinate object
            return self.image[self.index(index1)];
        } else {
            return self.image[self.index(index1, index2)];
        }
    },
    
    // given x,y coordinates, what is a the flatarray index
    index: function( index1, index2 ) {
        var self = this;
        
        if (index2 === undefined) { // coordinate object
            return index1.y*self.width+index1.x;
        } else {
            if (isNaN(index1) || isNaN(index2)) throw "can't index with non-numbers!";
            return index2*self.width+index1;
        }
    },
    
    // takes in an index in the flat array
    // returns the x,y coordinates it corresponds to
    coord: function( index ) {
        var self = this;
        
        if (isNaN(index)) throw "can't get coords for a non-number index!";
        
        return {
            x: index % self.width,
            y: Math.floor( index / self.width ),
            equals: function(coordinate) {
                return (this.x == coordinate.x) && (this.y == coordinate.y);
            },
            print: function() {
                return "(" + this.x + "," + this.y + ")";
            },
        };
    },
    
    // this is a just in case
    setter: function( value, index1, index2 ) {
        var self = this;
        
        if (index2 === undefined) {
            self.image[index1] = value;
        } else {
            self.image[index2*self.width + index1] = value;
        }
    },
    
};
