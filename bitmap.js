// canvasElement gotten from document.getElementById('example')
// where example is the canvas element

// threshold = float (percentage at which assumed white)
// threshold = 0 means cut off is at pure black
// threshold = 1 means cut off is at pure white

Bitmap = function (canvasElement, threshold) {
    
    this.width  = canvasElement.width;
    this.height = canvasElement.height;
    this._flatimagesize = width*height;
    
    var context = canvasElement.getContext('2d');
    var threshold = threshold || 0;
    var imageData = context.getImageData(0,0,width,height);
    
    
    this.image = new Int8Array(this._flatimagesize);
    
    // get greyscale to go away (stick inside a function) later
    for (var i = 0; i < this._flatimagesize; i++) {
        var greyscale = (imageData[i*4]+imageData[i*4+1]+imageData[i*4+2])/(3*255);
        // 1 means it is black, 0 means it is white
        this.image[i] = greyscale < threshold ? 1 : 0;
    };
};

Bitmap.prototype = {

    writeToCanvas: function() {
        var tempCanvas = document.createElement('canvas');
        var tempContext = tempCanvas.getContext('2d');
        var tempPixels = tempContext.createImageData(width, height);
        for (var i = 0; i < this._flatimagesize; i++) {
            tempPixels.data[i*4]   = 255*this.image[i];
            tempPixels.data[i*4+1] = 255*this.image[i];
            tempPixels.data[i*4+2] = 255*this.image[i];
            tempPixels.data[i*4+3] = 255;
        };
        tempCanvas.putImageData(tempPixels,width,height);
        return tempCanvas;
    },
    
    indexer: function ( index1, index2 ) {
        if (index2 === undefined) {
            return this.image[index1];
        } else {
            // index1 = x, index2 = y
            return this.image[index2*width + index1];
        }
    },
    
    setter: function( value, index1, index2 ) {
        if (index2 === undefined) {
            this.image[index1] = value;
        } else {
            this.image[index2*width + index1] = value;
        }
    }
    
    // I don't know if we'll need this
    //slicer: function( index1, index2, index3, index4 ),
    
};
