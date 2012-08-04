// canvasElement gotten from document.getElementById('example')
// where example is the canvas element

// threshold = float (percentage at which assumed white)
// threshold = 0 means color must be exactly white or it counts as black

Bitmap = function (canvasElement, threshold) {
    this.init(canvasElement, threshold);
};

Bitmap.prototype = {
    
    var self = this;

    init: function (canvasElement, threshold) {
        this.width  = canvasElement.width;
        this.height = canvasElement.height;
        this._flatimagesize = this.width*this.height;
        
        var context = canvasElement.getContext('2d');
        var threshold = threshold || 0;
        var imageData = context.getImageData(0,0,this.width,this.height);
        
        this.image = new Int8Array(this._flatimagesize);
        
        // get greyscale to go away (stick inside a function) later
        for (var i = 0; i < this._flatimagesize; i++) {
            var greyscale = (imageData.data[i*4]
                            +imageData.data[i*4+1]
                            +imageData.data[i*4+2])
                            /(3*255);
            this.image[i] = greyscale <= threshold ? 0 : 1;
        };
    },
    
    writeToCanvas: function() {
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.width;
        tempCanvas.height = this.height;
        var tempContext = tempCanvas.getContext('2d');
        var tempPixels = tempContext.createImageData(this.width, this.height);
        for (var i = 0; i < this._flatimagesize; i++) {
            tempPixels.data[i*4]   = 255*(1-this.image[i]);
            tempPixels.data[i*4+1] = 255*(1-this.image[i]);
            tempPixels.data[i*4+2] = 255*(1-this.image[i]);
            tempPixels.data[i*4+3] = 255;
        };
        tempContext.putImageData(tempPixels,0,0);
        return tempCanvas;
    },
    
    indexer: function ( index1, index2 ) {
        if (index2 === undefined) {
            return this.image[index1];
        } else {
            // index1 = x, index2 = y
            return this.image[index2*this.width + index1];
        }
    },
    
    setter: function( value, index1, index2 ) {
        if (index2 === undefined) {
            this.image[index1] = value;
        } else {
            this.image[index2*this.width + index1] = value;
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
    }, */
    coord: {
        x: function (index) { return index % self.width },
        y: function (index) { return Math.floor( index / self.width ) }
    },
    
    
    // I don't know if we'll need this
    //slicer: function( index1, index2, index3, index4 ),
    
};


//i just don't like this
make_drafter = function (canvasElement, threshold) {
    new_drafter = Object.create(Drafter);
    new_drafter.init(canvasElement, threshold);
    return new_drafter;
};

drafterPrototype = Object.create(Bitmap.prototype);

drafterPrototype.findStart = function() {
    for (var i = 0; i < this._flatimagesize; i++) {
        if (this.image[i] === 1) {
            return coord(i);
        }
    }
    return null;
};
