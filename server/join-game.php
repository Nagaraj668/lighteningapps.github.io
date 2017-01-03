<?php
include 'game-controller.php';
$jsonString = json_decode ( file_get_contents ( 'php://input' ), true );
$gameController = new GameController ();
$response = $gameController->joinGame($jsonString, $jsonString["id"]);
echo json_encode ( $response );
?>

