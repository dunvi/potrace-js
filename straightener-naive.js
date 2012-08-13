// handles the straightening stuff
Straightener = {
    
    path: undefined,
    start: undefined, // path indexer object
    end: undefined, // path indexer object
    longest: new Array(),
    
    init: function(path) {
        var self = this;
        
        self.longest.length = 0;
        self.path = path;
        
        return self;
    },
    
    // returns false when it cannot be considered straight anymore
    isStraight: function() {
        var self = this;
        
        //console.log("entering isStraight: ", self.start.i, self.end.i);
        
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
            //console.log(self.start.i, mid.i, self.end.i, mindist, length);
            if (length > 1) return false;
            
            x++;
        }
        
        return true;
        /*
        for (var x = self.start.i + 1; x < self.end.i; x++) {
            mid = self.path.indexer(x);
            length = Math.abs( (mid.x - self.start.x) * (self.end.y - self.start.y)
                             - (mid.y - self.start.y) * (self.end.x - self.start.x) )
                     / mindist;
            console.log(self.start.i, mid.i, self.end.i, mindist, length);
            if (length > 1) return false;
        }
        
        return true;
        */
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
        // dont forget the directional check... hmmmmmmm
        
        var dirs = new Array();
        for (var i = 0; i < path.length; i++) {
            self.start = path.indexer(i);
            dirs.length = 0;
            
            var dir;
            var j = 1;
            while (true) {
                self.end = path.indexer(self.start.i + j);
                
                // if you have gone all four directions, break!
                // this is disgustingly ugly here
                dir = path.getDir(self.end.i);
                //console.log(dir);
                if (dir === Direction.north) dirs[0] = 1;
                else if (dir === Direction.south) dirs[1] = 1;
                else if (dir === Direction.east ) dirs[2] = 1;
                else if (dir === Direction.west ) dirs[3] = 1;
                
                if (!isNaN(dirs[0] + dirs[1] + dirs[2] + dirs[3])) break;
                
                // we know that the 2 js are always straight
                if (j > 2) if (!self.isStraight()) break;
                
                self.longest[i] = self.end.i;
                j++;
                
                //console.log(self.start, self.end);
            }
        }
        // at end, for each i, longest[i] should hold the index of path
        // for which i could be connected to and still considered straight
        
        return self;
    },
    
};
