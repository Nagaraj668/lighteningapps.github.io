<?php
include 'db-executor.php';
class UserController {
	var $db;
	function __construct() {
		$this->db = new DBExecutor ();
	}
	function registerUser($userObj) {
		if ($this->isMobileNoExists ( $userObj ['mobile'] )) {
			$response = "This Mobile no has been already registered with us.";
		} else if ($this->isEmailExists ( $userObj )) {
			$response = "This Email id has been already registered with us.";
		} else {
			
			$query = "insert into person (name, email, mobile, address, date_of_birth,user_password, user_status) values('" . 

			$userObj ['firstName'] . "', '" . $userObj ['email'] . "', '" . $userObj ['mobile'] . "','" . $userObj ['address'] . "','" . 

			$userObj ['dateOfBirth'] . "','" . $userObj ['password'] ."', now() )";
			
			$response = $this->db->executeDML ( $query );
			
			if ($response != 1) {
				$response = 0;
			} else {
				$response = "Registration Success";
			}
			
			$this->db->close ();
		}
		return $response;
	}
	function isMobileNoExists($mobile) {
		$query = "select mobile from person where mobile = '" . $mobile . "'";
		$result = $this->db->executeDRL ( $query );
		if ($result->num_rows > 0) {
			return true;
		} else {
			return false;
		}
	}
	function isEmailExists($userObj) {
		$query = "select email from person where email = '" . $userObj ['email'] . "'";
		$result = $this->db->executeDRL ( $query );
		if ($result->num_rows > 0) {
			return true;
		} else {
			return false;
		}
	}
	function loginUser($userObj) {
		$query = "select id, name, email, mobile from person where " . "(email = '" . $userObj ['username'] . "' or mobile = '" . $userObj ['username'] . "') AND user_password = '" . $userObj ['password'] . "'";
		$result = $this->db->executeDRL ( $query );
		if ($result->num_rows > 0) {
			$rows = array ();
			while ( $r = $result->fetch_assoc () ) {
				$rows [] = $r;
			}
			$this->db->close ();
			return json_encode ( $rows );
		}
	}
	
	function getFriends($userObj) {
		$query = "select id, name, email, mobile from person where id != " . $userObj['id'] ."";
		$result = $this->db->executeDRL ( $query );
		if ($result && $result->num_rows >= 1) {
			$rows = array ();
			while ( $r = $result->fetch_assoc () ) {
				$rows [] = $r;
			}
			$this->db->close ();
			return json_encode ( $rows );
		}
	}
}

?>