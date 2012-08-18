// polygon builder
SumMatrix = {
    x:  0,
    y:  0,
    x2: 0,
    xy: 0,
    y2: 0,
    
    init: function(x, y, x2, xy, y2) {
        var self = this;
        
        self.x = x;
        self.y = y;
        self.x2 = x2;
        self.y2 = y2;
        self.xy = xy;
        
        return self;
    },
};

Polygon = {
    
    sums: undefined,
    path: undefined,
    
    init: function(path) {
        var self = this;
        
        self.path = path;
        self.sums = new Array();
        return self.calcSums();
    },
    
    // fills in sums[i+1] with values calculated from sums[i]
    calc: function(i, x, y) {
        var self = this;
        
        console.log("entered calc");
        
        self.sums[i+1] = Object.create(SumMatrix).init( 
                self.sums[i].x + x,
                self.sums[i].y + y,
                self.sums[i].x2 + x * x,
                self.sums[i].xy + x * y,
                self.sums[i].y2 + y * y );
        
        return self;
    },
    
    calcSums: function() {
        var self = this;
        
        var x0 = self.path.indexer(0).x;
        var y0 = self.path.indexer(0).y;
        self.sums[0] = Object.create(SumMatrix).init(0,0,0,0,0);
        
        var x, y;
        for (var i = 0; i < self.path.length; i++) {
            x = self.path.indexer(i).x - x0;
            y = self.path.indexer(i).y - y0;
            
            self.calc(i,x,y);
        }
            
        return self;
    },
    
    // assumes the sums matrix is already filled
    penalty: function() {
        
    },
    
};