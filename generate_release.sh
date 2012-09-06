# Generates a zip file with the minified and non-minified versions of the code.

rm -r gpa_calc.zip
rm -r gpa_calc_min.zip

mkdir gpa_calc
mkdir gpa_calc_min

cp -r css gpa_calc/css
cp -r css gpa_calc_min/css

mkdir gpa_calc_min/js
cat js/gpa_*.js | jsmin > gpa_calc_min/js/gpa_calc_min.js
cp -r js/init_example.js gpa_calc_min/js
cp -r js gpa_calc/js

cp gpa_calc.html gpa_calc/
cp gpa_calc_min.html gpa_calc_min/gpa_calc.html

cp LICENSE gpa_calc/
cp LICENSE gpa_calc_min/

cp README.md gpa_calc/
cp README.md gpa_calc_min/

zip -r gpa_calc.zip gpa_calc/*
zip -r gpa_calc_min.zip gpa_calc_min/*

rm -r gpa_calc/
rm -r gpa_calc_min/
