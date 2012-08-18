README

potrace-js

A javascript implementation of Peter Selinger's raster to vector image 
converter [potrace](http://potrace.sourceforge.net/), originally 
implemented in C.

The vague intention is to eventually create a javascript web app, using
HTML5 canvas either for simple drawings, or the option to upload images
(of reasonable size, please, heh), and returning SVG vector versions
which, may I point out, are built directly into HTML5.

Tested in Chrome v21.0.1180.75.

Python may have existed at some point.
(See [thomasballinger](https://github.com/thomasballinger/)'s 
[potrace-python](https://github.com/thomasballinger/potrace-python/).)

Developed during hackerschool, summer 2012.

-----------------------------------------------------------------------
-----------------------------------------------------------------------

Some implementation details:

The BitMap object is one of the "primitives". This essentially 
represents the image and the methods that a basic image should have.

The Path object is the other "primitive". It represents a single,
fully cyclical, 2 dimensional path (it can be indexed in either 
direction, for a theoretically infinite number of iterations), and 
contains the methods necessary to do so. Note that while a path is
aware of its 2 dimensional nature, and therefore indexes to paired x,y 
coordinates, it does not have any knowledge of the image to which
these coordinates relate. Indexer objects have two methods, called prev
and next, which return the previous and next indexer objects. Handy -
helps avoid that ugly path.indexer(path.mod(self.start.i+1)) math.

The bitmap has a descendent called Drafter. A drafter is aware of the
purpose of a path, but never generates one, only uses them as
parameters for operations that alter the image.

The "highest" level class is called the PathBuilder. The pathbuilder is
the object that will handle the creation of the vector paths from start
to finish (at least at the moment until refactored again :P). There are
currently 2 implementations of straightener, one inside the file
"straightener-naive.js" and the other inside "straightener-complex.js".
The two implementations should be invisibly interchangeable - both are
called using Object.create, and run using its method "run". At the
moment, they just return self, but later may instead return the array 
of arrays holding the longest path segments possible from each vertex,
instead of the entire straightener object.

Of the two implementations, the naive one works in O(n^3) time but is
fully operational. The complex one is operational, and now outputs
reasonable results. However, because of the timing notes below, the
naive implementation will be used until further notice.

There is an additional "helper object" called Direction. It contains
the 4 coordinate directions north, south, east, and west, and (more
importantly) handles the meaning of "turn left" and "turn right".


-----------------------------------------------------------------------

A slightly confusing thing about the current implementations: 
deciding whether to make a certain type of turn is a member function of
the Drafter object because it requires knowledge of the image details. 
Deciding which turn to try in the first place (called the turn policy) 
is a member of the PathBuilder class because the specific turn policy 
used is unrelated to the underlying image.


THOUGHTS: should straightness be handled inside pathbuilder objects?
Should we already be expanding into yet another object? After all,
straightness is a detail that uses completed paths, not something
related to paths. The underlying question here is whether paths refers
strictly to coordinate-based paths, or if vector paths are the real
meaning in use here!



7/14/2012: some timing runs:
    371,367,369,371,355,357,358,352,332,364ms with straightener-naive
        avg: 359.6
    412,380,420,401,385,383,393,419,374,369ms with straightener-complex
        avg: 393.6
    
    some possible explanations:
        lack of optimization yet implemented in straightener-complex
        incomplete or incorrect implementation
        greater startup costs require a larger dataset to reap the 
          benefits of the O(n^2) alg over the O(n^3)


-----------------------------------------------------------------------

