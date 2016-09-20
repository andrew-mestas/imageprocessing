# imageprocessing

Parallel implementation of k-means algorithm for real time image compression and analysis. 

Using canvas and webcam each frame is composed of an array of values representing R G B A respectively. 

With this in mind we transform and reduce dimensions of data for more efficient processing. 

Given a 320 x 240 image the returned set of values totals to 307200. 
After discarding the Alpha channel and restructuring to a matrix we are left with 76800 units to process.

There is a range of 16 values to check for with each pixels' data.
A is the raw info
B is restructured

If A = Height * Width * 4
then B = A / 4

Further testing resulted in a parallel implementation. Where the canvas is divided into a factor of both the 
height and width. Given a 320 x 240 canvas we can divide by a factor of 80 to create an 80 x 80 matrix of 
3x4 matrices. Then for each section there is a dedicated worker to find the closest color match. By dividing 
the work into such a small area processing time is nearly instant.

The scale factor you use can be set depending on the amount of classifications you want to be the limit of 
your intent. For instance with a factor of 80 you will have a 6400 number array that can range from 0-15. 

As follows: 

H = height 
W = width
F = factor of height and width

As F increases then possible representations = 16 ^ (F^2).

So in the example of a factor of 4 we theoretically have 18446744073709552000 possible unique representations.

In this base 16 system as you increase the factor you increase the possible unique representations. 
Visually 
 lets say in a perfect world with not external noise a red apple looks like this 
 00000000000000
 00004444440000
 00044444444000
 00000444440000
 00000000000000
 
 In the case what if we have more but with noise
 
 00000000000000  00034234999010  00000000000000  00012789903210  00000000014660  02356632000000
 00004444440000  00004444440530  00004444440000  00004444440000  00004444640000  00004444440000
 00044444444000  00044444444000  00044444444000  11144444444000  00044344444000  00044416444000
 00000444440000  00000444440020  00000444440000  00000444440000  00000442424000  00000444440000
 00000000000000  00599100000000  00111111111110  00000000000000  03213214997400  00000110226000
 
 We can unroll these matrices and do a similarity check by taking the logical AND of them all.
