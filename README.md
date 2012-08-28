GPA Calculator
==============

An open-source GPA calculator originally written for
[use at Cal Poly](https://myportal.calpoly.edu/gpaCalculator.jsp) in San
Luis Obispo, California, but you can use it at any school with a four point
grading scale.

Future
------

I'm using the 'version2.0' branch for a rewrite of the calculator. Modularity
will be the key feature in the new version, with the ability to define your
own update(...) function that will allow schools with different grading
scales to easily adapt the calculator without having to dig through too much
code. I'll provide a jQuery plugin wrapper so it's easy to figure out what
to change.
