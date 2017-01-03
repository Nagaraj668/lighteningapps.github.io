

<?php
include 'db-handler.php';
class DBExecutor {
	var $dbHandler;
	var $dbConnection;
	function __construct() {
		$this->dbHandler = new DBHandler ();
		$this->dbConnection = $this->dbHandler->getConnection ();
	}
	function executeDML($sqlQeury) {
		return $this->dbConnection->query ( $sqlQeury );
	}
	function executeDRL($sqlQeury) {
		return $this->dbConnection->query ( $sqlQeury );
	}
	function close() {
		$this->dbHandler->close ();
	}
}
?>