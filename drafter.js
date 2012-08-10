// Anything that deals with the actual potrace implementation
// should go inside drafter, NOT bitmap
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
    
    // spaceFill will return the full set of all points
    // this will then be used for both turdsize (area = length)
    // and for invert
    spaceFill: function(path) {
        var self = this;
        var hold = new Array();
        
        var current;
        for (var i = 0; i < path.length; i++) {
            current = path.indexer(i);
            
            if (hold[current.x] === undefined) {
                hold[current.x] = new Array();
            }
            
            hold[current.x].push(current);
        } // now hold has all path pixels sorted by x value
        
        // sort holds,
        var looked = new Array();
        var lookat, last;
        for (var i = 0; i < hold.length; i++) {
            // short circuit all of those initial ones
            if (hold[i] === undefined) continue;
            
            lookat = hold[i];
            looked.length = 0;
            
            for (var j = 0; j < lookat.length; j++) {
                // this should also eliminate any accidental duplicates
                // though there shouldn't be any
                looked[lookat[j].y] = lookat[j];
            }
            
            // kill hold[i], replace with newly schmanced up array
            hold[i].length = 0;
            // clean out last
            last = undefined;
            
            
            // now this is working - can i clean this up?
            for (var j = 0; j < looked.length; j++) {
                // short circuit initial ones again
                if (looked[j] === undefined) ;
                
                // skip concave blocks
                else if (self.indexer(i, j+1) === 1
                         && self.indexer(i, j-1) === 1) ;
                else {
                    // if this is an opening one
                    if (last === undefined) hold[i].push(looked[j]);
                    // if this one is right next to the previous one
                    else if (looked[j].y - last.y === 1) {
                        // only keep it if it's the end of a sequence
                        if (self.indexer(i, j+1) === 0) {
                            hold[i].push(looked[j]);
                        }
                    }
                }
                last = looked[j];
            }
        }
        
        // take top two from list
        // push on all inbetween
        
        var pixels = new Array();
        
        var start, end;
        for (var i = 0; i < hold.length; i++) {
            // short circuit
            if (hold[i] === undefined || hold[i].length < 2) {
                continue;
            }
            
            start = hold[i].shift().y;
            end = hold[i].shift().y;
            for (var j = start; j <= end; j++) {
                pixels.push(self.coord(self.index(i,j)));
            }
        }
        
        return pixels;
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
    
    // takeLeftTurn is always trivial because of left-handed wallbanging
    
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
            tempPixel = self.index(tempPixel.x, tempPixel.y);
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
