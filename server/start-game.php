<?php
include 'game-controller.php';

$jsonString = json_decode ( file_get_contents ( 'php://input' ), true );

$gameController = new GameController ();

$startGameResponse = $gameController->newGame ( $jsonString );

echo $startGameResponse;

?>