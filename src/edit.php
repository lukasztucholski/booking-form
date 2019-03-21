<?php 
  $userToEdit = $_POST['userToEdit'];
  if ($userToEdit) {
    $fp = fopen("backend.json", "r");
    $oldJSON = fread($fp, filesize("backend.json"));
    fclose($fp);
    $decodedDatabase = json_decode($oldJSON, true);
    $decodedUser = json_decode($userToEdit, true);
    foreach($decodedDatabase["users"] as &$user) {
      if ($user["id"] === $decodedUser["id"]) {
        $user = $decodedUser;
      }
    }
    $newJSON = json_encode($decodedDatabase);
    $fp = fopen("backend.json", "w");
    fputs($fp, $newJSON);
    fclose($fp);
    echo "Success!"; 
    };
?>