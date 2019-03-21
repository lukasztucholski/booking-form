<?php 
  $reservation = $_POST['reservation'];
  if ($reservation) {
    $fp = fopen("backend.json", "r");
    $oldJSON = fread($fp, filesize("backend.json"));
    fclose($fp);
    $decodedDatabase = json_decode($oldJSON, true); 
    $decodedReservation = json_decode($reservation, true); 
    $decodedDatabase["reservedDates"][] = $decodedReservation; 
    $newJSON = json_encode($decodedDatabase);  
    $fp = fopen("backend.json", "w"); 
    fputs($fp, $newJSON);              
    fclose($fp); 
    echo "Dane zostały zapisane!"; 
  };
?>