// the directions
Direction = {
    north: 'N',
    south: 'S',
    east: 'E',
    west: 'W',
    
    // with C-type enums I could totally cheat this in
    // an awesome way. oh well.
    
    left: function(direction) {
        if (direction === this.north) return this.west;
        if (direction === this.south) return this.east;
        if (direction === this.east) return this.north;
        if (direction === this.west) return this.south;
    },
    right: function(direction) {
        if (direction === this.north) return this.east;
        if (direction === this.south) return this.west;
        if (direction === this.east) return this.south;
        if (direction === this.west) return this.north;
    },
};
