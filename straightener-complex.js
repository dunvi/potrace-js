/* The Straightener API:

The straightener gets called from the PathBuilder

var mystraighter = Object.create(Straightener).initAll(allCycles);

*/

// handles the straightening stuff
StraightenerComplex = {
    
    path: undefined,
    start: undefined, // coordinate object
    end: undefined, // coordinate objects
    longest: new Array(),
    longests: new Array(),
    // A and B actually stand for above and below :P
    // although above and below are technically meaningless lol
    constraintA: undefined, // note these are uninitialized!
    constraintB: undefined, // initialized inside the main loop
    
    offset: Object.create(Vector).init0(),
    
    init: function(path) {
        var self = this;
        
        self.longest.length = 0;
        self.path = path;
        
        return self.findStraights();
    },
    
    initAll: function(allCycles) {
        var self = this;
        
        constraintA = Object.create(Vector);
        constraintB = Object.create(Vector);
        
        for (var i = 0; i < allCycles.length; i++) {
            self.init(allCycles[i]);
            self.longests.push(new Int8Array(self.longest));
            console.log("Straightened a path!");
        }
        
        return self;
    },
    
    // constraintCheck returns true if the end coord object
    // falls outside the constraints (fails straightness test)
    // end is a coordinate object
    constraintCheck: function() {
        var self = this;
        
        current = Object.create(Vector).init(self.start, self.end);
        
        if (self.cross(constraintA, current) < 0
           || self.cross(constraintB, current) > 0) return true;
        return false;
    },
    
    setConstraints: function() {
        var self = this;
        
        current = Object.create(Vector).init(self.start, self.end);
        
        if (Math.abs(current.x) <= 1 && Math.abs(current.y) <= 1) return self;
        
        // check against constraintA
        self.offset.x = current.x 
                   + (current.y >= 0 && (current.x < 0 || current.y > 0) 
                     ? 1 : -1);
        self.offset.y = current.y
                   + (current.x <= 0 && (current.x < 0 || current.y > 0)
                     ? 1 : -1);
        if (self.cross(constraintA, self.offset) >= 0) {
            constraintA.x = self.offset.x;
            constraintA.y = self.offset.y;
        }
        
        // check against constraintB
        self.offset.x = current.x 
                   + ((current.y <= 0 && (current.x > 0 || current.y < 0))
                     ? 1 : -1);
        self.offset.y = current.y
                   + ((current.x >= 0 && (current.x > 0 || current.y < 0))
                     ? 1 : -1);
        if (self.cross(constraintB, self.offset) <= 0) {
            constraintB.x = self.offset.x;
            constraintB.y = self.offset.y;
        }
        
        return self;
    },
    
    findStraights: function() {
        var self = this;
        var path = self.path;
        
        var dir, k;
        var dirs = new Array();
        
        // if you use i you're safe. if you use i+anything you must reindex
        for (var i = path.length - 1; i >= 0; i--) {
            self.start = path.indexer(i);
            dirs.length = 0;
            
            constraintA.init0();
            constraintB.init0();
            
            self.end = self.start.next();
            while (true) {
                self.end = self.end.next();
                // feel free to tell me what this check is for <.<
                if (self.start.i < path.length-1
                   && self.cyclic(self.end.i,
                                  self.start.i, 
                                  self.longest[self.start.next().i])) {
                    break;
                }
                
                // then check directions
                dir = path.getDir(self.end.i);
                
                if      (dir === Direction.north) dirs[0] = 1;
                else if (dir === Direction.south) dirs[1] = 1;
                else if (dir === Direction.east ) dirs[2] = 1;
                else if (dir === Direction.west ) dirs[3] = 1;
                
                if (!isNaN(dirs[0] + dirs[1] + dirs[2] + dirs[3])) {
                    break;
                }
                
                // check constraints
                if (self.constraintCheck()) {
                    break;
                }
                
                // you made it!
                // update constraints
                self.setConstraints();
            }
            self.longest[i] = self.end.prev().i;
        }
        
        // there's some extra stuff that happens in the original
        // implementation (constraint.cL#92).
        // see if you can figure out why... later
        
        return self;
    },
    
    // returns true if points are in order on a circle,
    // a <= b < c < a
    // takes in just the indices
    cyclic: function(i, j, k) {
        if (i <= k) return (i <= j && j < k);
        else return (i <= j || j < k);
    },
    
    cross: function( v1, v2 ) {
        return v1.x * v2.y - v2.x * v1.y;
    },
};
