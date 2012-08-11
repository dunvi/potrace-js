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
    
    // returns false when it cannot be considered straight anymore
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
    
    findStraights: function() {
        // okay what do we start with?
        // we start with a longest array that needs to be filled
        // we start knowing the path that we're going to look at
        // that's about it.
        var self = this;
        var path = self.path;
        var start = self.start;
        var end = self.end;
        
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
            start = path.indexer(i);
            dirs.length = 0;
            
            var dir;
            var j = 1;
            while (true) {
                end = path.indexer(start.i + j);
                
                if (!self.isStraight()) break;
                
                // this is disgustingly ugly here
                dir = path.getDir(end.i);
                if (dir === Direction.north) dirs[0] = 1;
                else if (dir === Direction.south) dirs[1] = 1;
                else if (dir === Direction.east ) dirs[2] = 1;
                else if (dir === Direction.west ) dirs[3] = 1;
                // if you have gone all four directions, break!
                if (!isNaN(dirs[0] + dirs[1] + dirs[2] + dirs[3])) break;
                
                self.longest[i] = end.i;
                j++;
            }
        }
        // at end, for each i, longest[i] should hold the index of path
        // for which i could be connected to and still considered straight
        
        console.log(self.longest);
        
        return self;
    };
    
};
