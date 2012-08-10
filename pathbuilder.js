// here's some work
PathBuilder = {
    
    currentCycle: new Array(),
    allCycles: new Array(),
    
    // should take in at least the image
    // by image I mean a Bitmap... I think...
    init: function(image) {
        var self = this;
        
        self.image = image;
        return self;
    },
    
    // create
    // this finds a path, and builds it
    // if it does not find a new path, returns null
    // otherwise it builds the whole thing, calls 
    // finalize, and returns self
    create: function() {
        var self = this;
    
        var startat = self.image.findStart();
        if (startat === null) return null; // no more!
        
        self.leftTurnPolicy(startat, Direction.south);
        
        // now we've generated a whole path
        return self.finalize();
    },
    
    // if one input, it should be a coord thing from bitmap
    push: function(index1, index2) {
        var self = this;
        
        if (index2 === undefined) {
            self.currentCycle.push(index1.x);
            self.currentCycle.push(index1.y);
            return self;
        } else {
            self.currentCycle.push(x);
            self.currentCycle.push(y);
            return self; // more chaining possibilities!
        }
        return null; // something super weird just happened :)
    },
    
    // what does it take in?
    finalize: function() {
        var self = this;
        
        // turdsize check should go here
        var turdsize = 10;
        // if area < turdsize, don't push the path (skip the next two lines)
        
        
        pushPath = Object.create(Path);
        pushPath.init(self.currentCycle)
        
        //console.log(pushPath.print());
        
        self.allCycles.push(pushPath);
        self.currentCycle.length = 0;
        
        
        // TODO later:
        //   unpad the paths here
        //   for now, we are assuming pre-padded images
        //   however, when we add in padding, we will
        //   need to unpad the images at some point
        //   and the best time to do that is probably here
        return self;
    },

    // WE CAN'T DO THIS YET BECAUSE WE STILL 
    // NEED TO INVERT ALL INNER PIXELS
    // createAll
    createAll: function() {
        var self = this;
        
        while (self.create() !== null) ;
        return self;
    },
    
    
    leftTurnPolicy: function (startat, dir) {
        var self = this;
        var image = self.image;
        
        var direction = dir
        var consider = startat;
        
        var sanitycheck = 0;
        
        while (sanitycheck < 500) {
            sanitycheck++;
            
            if (image.considerLeftTurn(consider, direction)) {
                // no need for a takeLeftTurn (trivial due to lefthanded)
                direction = Direction.left(direction);
                // no need to push - we're going to redo this pixel
            }
            else if (image.considerRightTurn(consider, direction)) {
                consider = image.takeRightTurn(consider, direction);
                direction = Direction.right(direction);
                self.push(consider);
            }
            else {
                consider = image.goStraight(consider, direction);
                self.push(consider);
            }
            
            if (consider.equals(startat)) return true;
        }
        
        throw "Taking too long: something might be wrong... breaking!";
    },
    
    rightTurnPolicy: function (startat, dir) {
        var self = this;
        var image = self.image;
        
        var direction = dir
        var consider = startat;
        
        var sanitycheck = 0;
        
        while (sanitycheck < 500) {
            sanitycheck++;
            
            if (image.considerRightTurn(consider, direction)) {
                consider = image.takeRightTurn(consider, direction);
                direction = Direction.right(direction);
                self.push(consider);
            }
            else if (image.considerLeftTurn(consider, direction)) {
                // takeLeftTurn is trivial
                direction = Direction.left(direction);
                // no need to push
            }
            else {
                consider = image.goStraight(consider, direction);
                self.push(consider);
            }
            
            if (consider.equals(startat)) return true;
        }
        
        throw "Taking too long: something might be wrong... breaking!";
    },
    
};
