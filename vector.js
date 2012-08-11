Vector = {
    
    x: undefined,
    y: undefined,
    
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
