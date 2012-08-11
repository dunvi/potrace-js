Vector = {
    
    x: undefined,
    y: undefined,
    
    init0: function() {
        var self = this;
        self.x = 0;
        self.y = 0;
        
        return self;
    },
    
    // takes in 2 coordinate objects
    init: function( start, end ) {
        var self = this;
        
        self.x = end.x - start.x;
        self.y = end.y - start.y;
        
        return self;    
    },
    
    print: function() {
        var self = this;
        
        return "<" + self.x + "," + self.y + ">";    
    },
    
};
