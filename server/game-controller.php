<?php
include 'db-executor.php';
class GameController {
	var $db;
	function __construct() {
		$this->db = new DBExecutor ();
	}
	function startGame($game) {
		$myFile = "words.txt";
		$lines = file ( $myFile );
		$randomWord = $lines [rand ( 0, 1924 )];
		
		$randomWord = trim ( preg_replace ( '/\s\s+/', '', $randomWord ) );
		$gameId = $this->generateGameId ();
		$query = "insert into game (id, title, started_by, word, game_mode_id) values(" . $gameId . ",'" . $game ['gameTitle'] . "', " . $game ['startedBy'] . ", '" . $randomWord . "'," . $game ['gameMode'] . ")";
		$response = $this->db->executeDML ( $query );
		if ($response != 1) {
			$response = 0;
		} else {
			$response = 200;
		}
		$this->updateGameProgress ( $game, $gameId );
		$this->db->close ();
		return $response;
	}
	function generateGameId() {
		$query = "select max(id) as ID from game";
		$result = $this->db->executeDRL ( $query );
		if ($result->num_rows > 0) {
			$rows = array ();
			while ( $r = $result->fetch_assoc () ) {
				$rows [] = $r;
			}
			$row = $rows [0];
			return $row ['ID'] + 1;
		}
	}
	function updateGameProgress($game, $gameId) {
		$players = $game ['selectedFriends'];
		for($i = 0; $i < sizeof ( $players ); $i ++) {
			$playerId = $players [$i];
			$query = "insert into game_progress (player_id, game_id) values(" . $playerId ['id'] . ", " . $gameId . ")";
			$response = $this->db->executeDML ( $query );
		}
		$query = "insert into game_progress (player_id, game_id) values(" . $game ['startedBy'] . ", " . $gameId . ")";
		$response = $this->db->executeDML ( $query );
	}
	function getOnGoingGames() {
		$query = "select * from game where won_by IS NULL and game_mode_id != 1";
		$result = $this->db->executeDRL ( $query );
		$rows = array ();
		try{
		if ($result->num_rows > 0) {
			while ( $r = $result->fetch_assoc () ) {
				$rows [] = $r;
			}
		}}catch(Exception $e){}
		return $rows;
	}
	function joinGame($game, $gameId) {
		$players = $game ['selectedFriends'];
		for($i = 0; $i < sizeof ( $players ); $i ++) {
			$playerId = $players [$i];
			$flag = $this->isAlreadyJoined ( $playerId, $gameId );
			if ($flag) {
				return "200";
			}
			$query = "insert into game_progress (player_id, game_id) values(" . $playerId ['id'] . ", " . $gameId . ")";
			$response = $this->db->executeDML ( $query );
		}
		$this->db->close ();
		return "200";
	}
	function isAlreadyJoined($playerId, $gameId) {
		$query = "select player_id from game_progress where game_id = " . $gameId . " AND player_id = " . $playerId['id'];
		$result = $this->db->executeDRL ( $query );
		if ($result->num_rows > 0) {
			return true;
		} else {
			return false;
		}
	}
	function wonGame($request){
		$wonBy = $request['won_by'];
		$query = "update game set won_by = " . $wonBy['id'] . " where id = " . $request['id'] ;
		$response = $this->db->executeDML ( $query );
		$this->db->close();
		return 200;
	}
}
?>