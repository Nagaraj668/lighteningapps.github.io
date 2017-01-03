<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cows_and_bulls";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "select id, name, email, mobile from person ";
$result = mysqli_query($conn, $sql);

function mysqli_field_name($result, $field_offset)
{
	$properties = mysqli_fetch_field_direct($result, $field_offset);
	return is_object($properties) ? $properties->name : null;
}

ob_end_clean ();

// I assume you already have your $result
$num_fields = mysqli_num_fields ( $result );

// Fetch MySQL result headers
$headers = array ();
$headers [] = "S.No";
for($i = 0; $i < $num_fields; $i ++) {
	$headers [] = strtoupper ( mysqli_field_name ( $result, $i ) );
}

// Filename with current date
$current_date = date ( "y/m/d" );
$filename = "MyFileName" . $current_date . ".csv";

// Open php output stream and write headers
$fp = fopen ( 'php://output', 'w' );
if ($fp && $result) {
	header ( 'Content-Type: text/csv' );
	header ( 'Content-Disposition: attachment; filename=' . $filename );
	header ( 'Pragma: no-cache' );
	header ( 'Expires: 0' );
	// Write mysql headers to csv
	fputcsv ( $fp, $headers );
	$row_tally = 0;
	// Write mysql rows to csv
	while ( $row = mysqli_fetch_array ( $result, MYSQL_NUM ) ) {
		$row_tally = $row_tally + 1;
		echo $row_tally . ",";
		fputcsv ( $fp, array_values ( $row ) );
	}
	die ();
}

?>