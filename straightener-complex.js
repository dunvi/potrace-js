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
    constraintA: Object.create(Vector), // note these are uninitialized!
    constraintB: Object.create(Vector), // initialized inside the main loop
    
    offset: Object.create(Vector).init0(),
    
    init: function(path) {
        var self = this;
        
        self.longest.length = 0;
        self.path = path;
        
        return self;
    },
    
    initAll: function(allCycles) {
    
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
    
    findStraights: function() {
        var self = this;
        var path = self.path;
        
        var kpivs = new Array();
        
        var dir, k;
        var dirs = new Array();
        
        for (var i = path.length - 1; i !== 0; i--) {
            constraintA.init0();
            constraintB.init0();
            dirs.length = 0;
            
            k = 1;
            while (true) {
                self.end = path.indexer(self.start.i + k);
                
                // first check directions
                dir = path.getDir(self.end.i);
                
                if      (dir === Direction.north) dirs[0] = 1;
                else if (dir === Direction.south) dirs[1] = 1;
                else if (dir === Direction.east ) dirs[2] = 1;
                else if (dir === Direction.west ) dirs[3] = 1;
                
                if (!isNaN(dirs[0] + dirs[1] + dirs[2] + dirs[3])) break;
                
                //otherwise check constraints
                if (k > 2) if (self.constraintCheck()) break;
                
                kpivs[i] = self.end.i;
                self.setConstraints();
                k++;
            }
        }
        
        // hack until we know why there are kpivs :P
        // start at line 198 here (on potrace-python)
        // try to pretend you know what's going on :P
        var j;
        longest[path.length-1] = j;
        
        for (var i = path.length - 1; i !== 0; i--) {
            longest[i] = kpivs[i];
        }
        
        return self;
    },
    
    cross: function( v1, v2 ) {
        return v1.x * v2.y - v2.x * v1.y;
    },
};
