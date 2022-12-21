<?php

$servername = "localhost";
$username = "root";
$password = "";
// $db_name = "sql_atk";
$db_name = "batukajar";

// Create connection
// $conn = mysqli_connect($servername, $username, $password, $db_name);
try {
    $conn = new PDO("mysql:host=$servername;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}


// Check connection
// if (!$conn) {
//     die("Connection failed: " . mysqli_connect_error());
// }
// echo "Connected successfully";
