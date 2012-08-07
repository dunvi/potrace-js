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
        }
        tempContext.putImageData(tempPixels,0,0);
        return tempCanvas;
    },

    // given x, y coordinates, what is the value?
    // (or a coordinate object)
    indexer: function ( index1, index2 ) {
        var self = this;
        
        if (index2 === undefined) {
            return self.image[self.index(index1)];
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
            print: function() {
                return "(" + this.x + "," + this.y + ")";
            },
        };
    },
    
};

//probably a better way of doing it
Drafter = Object.create(Bitmap);
extend(Drafter, {
    
    findStart: function() {
        var self = this;
        
        for (var i = 0; i < self.flatimagesize; i++) {
            if (self.image[i] === 1) {
                return self.coord(i);
            }
        }
        return null;
    },
    
    // auto handle flat coordinates
    // these return 1 if you should make that turn
    // index should be a coordinate object
    considerLeftTurn: function( index, direction ) {
        var self = this;
        
        var check = self.index(index);
        if (direction === 'N') check = self.coord(check - self.width);
        if (direction === 'E') check = self.coord(check + 1);
        if (direction === 'S') check = self.coord(check + self.width);
        if (direction === 'W') check = self.coord(check - 1);
        
        return self.indexer(check) === 0;
    },
    
    takeLeftTurn: function( index, direction ) {
        return index;
    },
    
    considerRightTurn: function( index, direction ) {
        var self = this;
        
        var check = self.index(index);
        if (direction === 'N') check = self.coord(check - self.width + 1);
        if (direction === 'E') check = self.coord(check + self.width + 1);
        if (direction === 'S') check = self.coord(check + self.width - 1);
        if (direction === 'W') check = self.coord(check - self.width - 1);
        
        return self.indexer(check) === 1;
    },
    
    takeRightTurn: function( index, direction ) {
        var self = this;
        
        var check = self.index(index);
        if (direction === 'N') return self.coord(check - self.width + 1);
        if (direction === 'E') return self.coord(check + self.width + 1);
        if (direction === 'S') return self.coord(check + self.width - 1);
        if (direction === 'W') return self.coord(check - self.width - 1);
    },
    
    goStraight: function( index, direction ) {
        var self = this;
        
        var check = self.index(index);
        if (direction === 'N') return self.coord(check - self.width);
        if (direction === 'E') return self.coord(check + 1);
        if (direction === 'S') return self.coord(check + self.width);
        if (direction === 'W') return self.coord(check - 1);
    },
    
    writePathToCanvas: function(path) {
        var self = this;
        
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = self.width;
        tempCanvas.height = self.height;
        var tempContext = tempCanvas.getContext('2d')
        var tempPixels = tempContext.createImageData(self.width, self.height);
        var tempPixel;
        for (var i = 0; i < path.length; i++) {
            tempPixel = path.indexer(i);
            tempPixel = self.index(tempPixel.x(), tempPixel.y());
            tempPixels.data[tempPixel*4]   = 0;
            tempPixels.data[tempPixel*4+1] = 0;
            tempPixels.data[tempPixel*4+2] = 0;
            tempPixels.data[tempPixel*4+3] = 255;
        }
        tempContext.putImageData(tempPixels,0,0);
        return tempCanvas;
    },
    
});

function extend(obj, props) {
    for (prop in props) {
        if (props.hasOwnProperty(prop)) {
            obj[prop] = props[prop];
        }
    }
};
