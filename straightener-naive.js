// handles the straightening stuff
Straightener = {
    
    path: undefined,
    start: undefined, // path indexer object
    end: undefined // path indexer object
    longest: new Array(),
    
    init: function(path) {
        var self = this;
        
        self.longest.length = 0;
        self.path = path;
        
        return self;
    },
    
    isStraight: function() {
        var self = this;
        var start = self.start;
        var end = self.end;
        
        if (end.i === start.i) throw "how did we get back here?";
        // it's always true if you are only 3 away!
        if (end.i - start.i < 3) return true;
        
        var normal = Math.sqrt( Math.pow(end.x - start.x, 2)
                              + Math.pow(end.y - start.y, 2));
        var mid = self.path.indexer(i);
        var length;
        for (var i = start.i + 1; i < end.i; i++) {
            length = Math.abs( (mid.x - start.x) * (end.y - start.y)
                             - (mid.y - start.y) * (end.x - start.x))
                     / normal;
            if (length > 1) return false;
        }
        
        return true;
    },
    
    
};
