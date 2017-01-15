#!/usr/bin/env bash
cd /Users/Zhou/WebstormProjects/FYP-GF/app

declare -a arr=(
"GF/PolynomialField" "app" "SlideNav/SliderNav" "view1/view1" "view2/view2" "invmod/sbox" "view2/conversionCtrl" "components/version/version" "components/version/version-directive" "components/version/interpolate-filter" "GF/util"
)

for i in "${arr[@]}"
do
    echo $i
    java -jar /Users/Zhou/WebstormProjects/closure-compiler-v20161201.jar --compilation_level SIMPLE_OPTIMIZATIONS --js $i.js --js_output_file $i.min.js

done


