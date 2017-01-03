<?php
include 'user-controller.php';
$jsonString = json_decode ( file_get_contents ( 'php://input' ), true );
$userController = new UserController ();
$friendsResponse = $userController->getFriends ($jsonString);
echo $friendsResponse;

?>
 