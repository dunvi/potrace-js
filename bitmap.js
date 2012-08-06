// canvasElement gotten from document.getElementById('example')
// where example is the canvas element

// threshold = float (percentage at which assumed white)
// threshold = 0 means color must be exactly white or it counts as black

Bitmap = {
    
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
        };
        tempContext.putImageData(tempPixels,0,0);
        return tempCanvas;
    },

    // given x, y coordinates, what is the value? (or a flat coordinate)
    indexer: function ( index1, index2 ) {
        var self = this;
        
        if (index2 === undefined) {
            return self.image[index1];
        } else {
            // index1 = x, index2 = y
            return self.image[self.index(index1, index2)];
        }
    },
    
    index: function( index1, index2 ) {
        var self = this;
        
        if (index2 === undefined) {
            // then it's a coordinate object
            return index1.y*self.width+index1.x;
        } else {
            // given x, y coordinates, what is the index?
            return index2*self.width+index1;
        }
    },
    
    setter: function( value, index1, index2 ) {
        var self = this;
        
        if (index2 === undefined) {
            self.image[index1] = value;
        } else {
            self.image[index2*self.width + index1] = value;
        }
    },
    
    // takes in an index in the flat array
    // returns the x,y coordinates it corresponds to
    coord: function( index ) {
        var self = this;
        
        return {
            x: index % self.width,
            y: Math.floor( index / self.width ),
            equals: function(coordinate) {
                return (this.x == coordinate.x) && (this.y == coordinate.y);
            },
        };
    },
    
};

//probably a better way of doing it
Drafter = Object.create(Bitmap, {
    
    findStart: function() {
        var self = this;
        
        for (var i = 0; i < self.flatimagesize; i++) {
            if (self.image[i] === 1) {
                return coord(i);
            }
        }
        return null;
    },
    
    // auto handle flat coordinates
    getCoord: function( index, direction ) {
        var self = this;
        
        if (direction === 'N') return self.coord(index - self.width);
        if (direction === 'E') return self.coord(index + 1);
        if (direction === 'S') return self.coord(index + self.width);
        if (direction === 'W') return self.coord(index - 1);
    },
    
});
