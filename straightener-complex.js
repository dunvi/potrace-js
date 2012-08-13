/* The Straightener API:

The straightener gets called from the PathBuilder

var mystraighter = Object.create(Straightener).initAll(allCycles);

*/

// handles the straightening stuff
Straightener = {
    
    path: undefined,
    start: undefined, // coordinate object
    end: undefined // coordinate objects
    longest: new Array(),
    // A and B actually stand for above and below :P
    // although above and below are technically meaningless lol
    constraintA: Object.create(Vector).init0(),
    constraintB: Object.create(Vector).init0(),
    
    offset: Object.create(Vector).init0(),
    
    init: function(path) {
        var self = this;
        
        self.longest.length = 0;
        self.path = path;
        
        return self;
    },
    
    // constraintCheck returns true if the end coord object
    // falls outside the constraints (fails straightness test)
    // end is a coordinate object
    constraintCheck: function() {
        var self = this;
        
        current = Object.create(Vector).init(self.start, self.end);
        
        if (self.cross(constraintA, current) < 0) return true;
        if (self.cross(constraintB, current) > 0) return true;
        return false;
    },
    
    setConstraints: function() {
        var self = this;
        
        current = Object.create(Vector).init(self.start, self.end);
        
        if (Math.abs(current.x) <= 1 && Math.abs(current.y) <= 1) return self;
        
        var offset = self.offset;
        
        // check against constraintA
        offset.x = current.x 
                   + (current.y >= 0 && (current.x < 0 || current.y > 0) 
                     ? 1 : -1);
        offset.y = current.y
                   + (current.x <= 0 && (current.x < 0 || current.y > 0)
                     ? 1 : -1);
        if (self.cross(constraintA, offset) >= 0) {
            constraintA.x = offset.x;
            constraintA.y = offset.y;
        }
        
        // check against constraintB
        offset.x = current.x 
                   + (current.y <= 0 && (current.x > 0 || current.y < 0) 
                     ? 1 : -1);
        offset.y = current.y
                   + (current.x >= 0 && (current.x > 0 || current.y < 0)
                     ? 1 : -1);
        if (self.cross(constraintB, offset) >= 0) {
            constraintB.x = offset.x;
            constraintB.y = offset.y;
        }
        
        return self;
    },
    
    
    cross: function( v1, v2 ) {
        return v1.x * v2.y - v2.x * v1.y;
    },
};
