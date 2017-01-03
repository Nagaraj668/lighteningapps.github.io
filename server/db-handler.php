<?php
class DBHandler {
	var $connection;
	function __construct() {
		// DB Configuration
		$HOST = "localhost";
		$USERNAME = "root";
		$PASSWORD = "";
		$DATABASE_NAME = "cows_and_bulls";
		$this->connection = new mysqli ( $HOST, $USERNAME, $PASSWORD, $DATABASE_NAME );
		// Check connection
		if ($this->connection->connect_error) {
			die ( "Connection failed: " . $conn->connect_error );
		}
	}
	function getConnection() {
		return $this->connection;
	}
	function close() {
		$this->connection->close ();
	}
}

?>