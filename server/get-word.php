<?php
$myFile = "words.txt";
$lines = file ( $myFile ); // file in to an array
echo $lines [rand ( 0, 1923 )];

?>