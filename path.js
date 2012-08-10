// takes in a path already inside an array
// so what you're going to want to do is build the array
// and then pass it in
// build the array as alternating x, ys
// so even numbers are x coordinates, odd numbers are ys.
// path will index using .indexer skipping as wanted

Path = {
    init: function(path) {
        var self = this;
        
        // pass in the path already gathered up
        self.length = path.length / 2;
        self.cycle = new Int8Array(path);
        return self;
    },
    
    // gets both x and y of a certain vertex
    indexer: function(index) {
        var self = this;
        var i = self.mod(index);
        
        return {
            x: self.cycle[i*2],
            y: self.cycle[i*2+1],
            print: function () { return "(" + this.x + "," + this.y + ")"; },
        };
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
        return index - self.length * Math.floor(index/self.length);
    },
};

Direction = {
    north: 'N',
    south: 'S',
    east: 'E',
    west: 'W',
    
    // with C-type enums I could totally cheat this in
    // an awesome way. oh well.
    
    left: function(direction) {
        if (direction === this.north) return this.west;
        if (direction === this.south) return this.east;
        if (direction === this.east) return this.north;
        if (direction === this.west) return this.south;
    },
    right: function(direction) {
        if (direction === this.north) return this.east;
        if (direction === this.south) return this.west;
        if (direction === this.east) return this.south;
        if (direction === this.west) return this.north;
    },
};
