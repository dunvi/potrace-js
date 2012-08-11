// handles the straightening stuff
Straightener = {
    
    path: undefined,
    longest: new Array(),
    
    init: function(path) {
        var self = this;
        
        self.longest.length = 0;
        self.path = path;
        
        return self;
    },
    
    
    
    
    cross: function( v1, v2 ) {
        return v1.x * v2.y - v2.x * v1.y;
    },
};
