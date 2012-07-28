README

potrace-js

A javascript implementation of Peter Selinger's raster to vector
image converter potrace (http://potrace.sourceforge.net/),
originally implemented in C.

Python may have existed at some point (see
https://github.com/thomasballinger/potrace-python/).

TODO:

Make container class (holds multiple Bitmaps for intermediate steps)
Make path class (should be cyclic)
Should we parallelize?
  (after all, once paths are generated, polygon generation
   can be done simultaneously without problem)
    web workers?



hackerschool-2012
