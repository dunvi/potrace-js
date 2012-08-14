/* The Straightener API:

The straightener gets called from the PathBuilder

var mystraighter = Object.create(Straightener).initAll(allCycles);

*/

// handles the straightening stuff
StraightenerNaive = {
    
    path: undefined,
    start: undefined, // path indexer object
    end: undefined, // path indexer object
    longest: new Array(),
    longests: new Array(),
    
    init: function(path) {
        var self = this;
        
        self.longest.length = 0;
        self.path = path;
        
        return self.findStraights();
    },
    
    // gets passed allcycles
    initAll: function(allCycles) {
        var self = this;
        
        for (var i = 0; i < allCycles.length; i++) {
            self.init(allCycles[i]);
            self.longests.push(new Int8Array(self.longest));
            console.log("Straightened a path!");
        }
        
        return self;
    },
    
    // returns false when it cannot be considered straight anymore
    isStraight: function() {
        var self = this;
        
        if (self.end.i === self.start.i) throw "how did we get back here?";
        
        var length, mid;
        var mindist = Math.sqrt( Math.pow(self.end.x - self.start.x, 2) 
                               + Math.pow(self.end.y - self.start.y, 2) );
        var x = self.start.i + 1;
        while (true) {
            mid = self.path.indexer(x);
            
            if (mid.i === self.end.i) break;
            
            length = Math.abs( (mid.x - self.start.x) * (self.end.y - self.start.y)
                             - (mid.y - self.start.y) * (self.end.x - self.start.x) )
                     / mindist;
            if (length > 1) return false;
            
            x++;
        }
        
        return true;
    },
    
    findStraights: function() {
        // okay what do we start with?
        // we start with a longest array that needs to be filled
        // we start knowing the path that we're going to look at
        // that's about it.
        var self = this;
        var path = self.path;
        
        // set start to path.indexer(0)
        // loop:
        //     set end to start+1
        //     loop:
        //        check for straightness
        //        if straight, increment end, continue
        //        if fails,
        //            set longest[i] to end
        //            increment start, break;
        
        var dir, j;
        var dirs = new Array();
        
        for (var i = 0; i < path.length; i++) {
            self.start = path.indexer(i);
            dirs.length = 0;
            
            k = 1;
            while (true) {
                self.end = path.indexer(self.start.i + k);
                
                // if you have gone all four directions, break!
                // this is disgustingly ugly here
                dir = path.getDir(self.end.i);
                
                if      (dir === Direction.north) dirs[0] = 1;
                else if (dir === Direction.south) dirs[1] = 1;
                else if (dir === Direction.east ) dirs[2] = 1;
                else if (dir === Direction.west ) dirs[3] = 1;
                
                if (!isNaN(dirs[0] + dirs[1] + dirs[2] + dirs[3])) break;
                
                // we know that the 2 js are always straight
                if (k > 2) if (!self.isStraight()) break;
                
                self.longest[i] = self.end.i;
                k++;
            }
        }
        // at end, for each i, longest[i] should hold the index of path
        // for which i could be connected to and still considered straight
        
        console.log("naive: ");
        console.log(JSON.stringify(self.longest));
        
        return self;
    },
    
};
