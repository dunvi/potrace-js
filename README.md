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
these coordinates relate.

Each of these two objects has a direct descendent object which is aware
of the relationship between an image and its paths.

The bitmap's descendent is called Drafter. A drafter is aware of the
purpose of a path, but never generates them, only uses them as
parameters for operations that alter the image.

The path's descendent is called a PathBuilder. A pathbuilder isn't a 
descendent so much as another object that handles the path primitive. A
pathbuilder contains multiple paths, as well as a reference to their
parent image, and is used to gather up all of the paths.

Some slightly confusing things about this: deciding whether to make a
certain type of turn is a member function of the Drafter object because
it requires knowledge of the image details. Deciding which turn to try
in the first place (known as the turn policy) is a member of the 
PathBuilder class because the specific turn policy used is unrelated to
the underlying image and is a detail used to build paths.

THE CURRENT QUESTION: should straightness be handled inside pathbuilder
or should we already be expanding into yet another object? Straightness
is, after all, a detail that uses completed paths, not something
related to paths. The underlying question here is whether paths refers
strictly to coordinate-based paths, or if vector paths are the real
meaning in use here!


There is an additional "helper object" called Direction. It contains
the 4 coordinate directions north, south, east, and west, and (more
importantly) handles the meaning of "turn left" and "turn right".
