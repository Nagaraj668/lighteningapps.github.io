<?php 

	include 'game-controller.php';
	$request = json_decode ( file_get_contents ( 'php://input' ), true );
	$gameController = new GameController();
	$response = $gameController->wonGame($request);
	echo $response;
?>