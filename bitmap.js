// canvasElement gotten from document.getElementById('example')
// where example is the canvas element

// threshold = float (percentage at which assumed white)
// threshold = 0 means color must be exactly white or it counts as black

Bitmap = function (canvasElement, threshold) {
    
    this.width  = canvasElement.width;
    this.height = canvasElement.height;
    this._flatimagesize = this.width*this.height;
    
    var context = canvasElement.getContext('2d');
    var threshold = threshold || 0;
    var imageData = context.getImageData(0,0,this.width,this.height);
    //console.log(imageData);
    
    
    this.image = new Int8Array(this._flatimagesize);
    
    // get greyscale to go away (stick inside a function) later
    for (var i = 0; i < this._flatimagesize; i++) {
        var greyscale = (imageData.data[i*4]
                        +imageData.data[i*4+1]
                        +imageData.data[i*4+2])
                        /(3*255);
        //console.log(imageData[i*4]); // gave us undefined here
        //console.log(imageData[i*4+1]);
        //console.log(imageData[i*4+2]);
        //console.log(greyscale); // gave us NaN
        // 1 means it is black, 0 means it is white
        this.image[i] = greyscale <= threshold ? 0 : 1;
    };
};

Bitmap.prototype = {

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
    }
    
    // I don't know if we'll need this
    //slicer: function( index1, index2, index3, index4 ),
    
};
