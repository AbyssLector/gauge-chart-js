<?php
include_once 'conn.php';

$query = "DELETE FROM kolam_1 WHERE created_at <= TIMESTAMP(DATE_SUB(NOW(), INTERVAL 60 day))";
$query = "DELETE FROM kolam_2 WHERE created_at <= TIMESTAMP(DATE_SUB(NOW(), INTERVAL 60 day))";
$conn->exec($query);
echo "OK!";
