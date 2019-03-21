<?php 
  $userToSignUp = $_POST['userToSignUp'];
  if ($userToSignUp) {
    $fp = fopen("backend.json", "r");
    $oldJSON = fread($fp, filesize("backend.json"));
    fclose($fp);
    $decodedDatabase = json_decode($oldJSON, true);
    $decodedUser = json_decode($userToSignUp, true);
    $decodedDatabase["users"][] = $decodedUser;
    $newJSON = json_encode($decodedDatabase);
    $fp = fopen("backend.json", "w");
    fputs($fp, $newJSON);
    fclose($fp);
    echo "Success!"; 
  };
?>