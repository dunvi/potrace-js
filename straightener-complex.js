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
        
        var dir, k;
        var dirs = new Array();
        
        // if you use i you're safe. if you use i+anything you must reindex
        for (var i = path.length - 1; i >= 0; i--) {
            self.start = path.indexer(i);
            dirs.length = 0;
            
            constraintA.init0();
            constraintB.init0();
            
            k = 2;
            while (true) {
                self.end = path.indexer(self.start.i + k);
                
                if      (self.start.i === path.length-1) ;//console.log("hit1");
                else if (self.cyclic(self.end.i, self.start.i, self.longest[path.mod(i+1)])) {
                    //console.log("hit2");
                    break;
                }
                
                // first check directions
                dir = path.getDir(self.end.i);
                
                if      (dir === Direction.north) dirs[0] = 1;
                else if (dir === Direction.south) dirs[1] = 1;
                else if (dir === Direction.east ) dirs[2] = 1;
                else if (dir === Direction.west ) dirs[3] = 1;
                
                if (!isNaN(dirs[0] + dirs[1] + dirs[2] + dirs[3])) {
                    //console.log("hit3");
                    break;
                }
                
                //otherwise check constraints
                if (self.constraintCheck()) {
                    //console.log("hit4");
                    break;
                }
                
                self.longest[i] = self.end.i;
                self.setConstraints();
                k++;
            }
        }
        
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
