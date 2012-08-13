// takes in a path already inside an array
// so what you're going to want to do is build the array
// and then pass it in
// build the array as alternating x, ys
// so even numbers are x coordinates, odd numbers are ys.
// path will index using .indexer skipping as wanted

Path = {
    
    length: undefined,
    cycle: undefined,
    
    init: function(path) {
        var self = this;
        
        // pass in the path already gathered up
        self.length = path.length / 2;
        self.cycle = new Int8Array(path);
        return self;
    },
    
    // gets both x and y of a certain vertex
    indexer: function(pathIndex) {
        var self = this;
        var index = self.mod(pathIndex);
        
        if (isNaN(index)) throw "can't index with a non-number!";
        
        return {
            x: self.cycle[index*2],
            y: self.cycle[index*2+1],
            i: index,
            print: function () { return "(" + this.x + "," + this.y + ")"; },
        };
    },
    
    // returns the direction from the previous point to the index
    getDir: function(index) {
        var self = this;
        
        var prev = self.indexer(index-1);
        var curr = self.indexer(index);
        
        var xdiff = curr.x - prev.x;
        if (xdiff ===  1) return Direction.east;
        if (xdiff === -1) return Direction.west;
        
        var ydiff = curr.y - prev.y;
        if (ydiff ===  1) return Direction.south;
        if (ydiff === -1) return Direction.north;
        
        throw "what direction are you going anyway?";
    },
    
    print: function() {
        var self = this;
        var result = "";
        
        for (var i = 0; i < self.length; i++) {
             result += self.indexer(i).print();
        } // (x1,y1)(x2,y2)...
        return result;
    },
    
    // a proper mathematical mod
    mod: function(index) {
        var self = this;
        
        if (isNaN(index)) throw "can't mod a non-number!";
        
        return index - self.length * Math.floor(index/self.length);
    },
};
