<?php 

	include 'game-controller.php';

	$gameController = new GameController();
	$response = $gameController->getOnGoingGames();
	echo json_encode($response);
?>