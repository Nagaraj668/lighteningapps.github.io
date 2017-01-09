<?php
include 'db-executor.php';
require_once('rest.inc.php');

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
	function newGame($request){
		$query = "insert into new_game (game_id, word1, word2) values('" . $request['gameId'] . "','" . $request ['word1'] . "', '" . $request ['word2'] . "')";
		$response = $this->db->executeDML ( $query );
		if ($response != 1) {
			$response = 0;
		} else {
			$response = 200;
		}
		$this->db->close ();
		return $response;
	}
	
	function accept($request){
		$query = "update new_game set word2 = '" . $request['word2'] . "' where game_id ='". $request ['gameId'] . "'";
		echo $query;
		$response = $this->db->executeDML ( $query );
		if ($response == 1) {
			$response = 200;
		} else {
			$response = 0;
		}
		$this->db->close ();
		return $response;
	}
	
	function attempt($request){
		$query = "select word".$request['type']." from new_game where game_id = '" . $request['gameId'] . "'";
		$result = $this->db->executeDRL ( $query );
		if ($result->num_rows > 0) {
			$targetWord = "";
			$index = "word".$request['type'];
			$guessedWord = $request['word1'];
			$bulls = 0;
			$cows = 0;
			while($row = $result->fetch_assoc()) {
				$word = $row[$index];
			}
			for ($i = 0; $i < strlen($targetWord); $i++) {
				for ($j = 0; $j < strlen(guessedWord); $j++) {
					if ($targetWord[i] == $guessedWord[j] && $i == $j) {
						$bulls++;
					} else if ($targetWord[i] == $guessedWord[j]
							&& $i != $j) {
								$cows++;
							}
				}
			}
			$result = RestCurl::post("https://fir-example-ac064.firebaseio.com/games/" . $request['gameId'] ."/attempts/".$request['uid'].".json", 
					array('word' => $request['word'], 'cows' => $cows, 'bulls' => $bulls));
			$this->db->close ();
			return 200;
		} else {
			$this->db->close ();
			return 0;
		}
	}
}
?>