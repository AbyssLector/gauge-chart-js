<?php
include_once 'conn.php';

if (strtoupper($_SERVER['REQUEST_METHOD']) == 'GET') {
    $query = "DELETE FROM kolam_1 WHERE created_at <= TIMESTAMP(DATE_SUB(NOW(), INTERVAL 60 day))";
    $query = "DELETE FROM kolam_2 WHERE created_at <= TIMESTAMP(DATE_SUB(NOW(), INTERVAL 60 day))";
    $conn->exec($query);
    try {
        $sql1 = "SELECT * FROM kolam_1 ORDER BY id DESC LIMIT 1";
        $sql2 = "SELECT * FROM kolam_2 ORDER BY id DESC LIMIT 1";
        $result1 = $conn->query($sql1)->fetch();
        $result2 = $conn->query($sql2)->fetch();
        http_response_code(200);
        echo json_encode(array('msg' => 'success', $result1, $result2));
    } catch (PDOException $e) {
        echo json_encode(array('msg' => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array('msg' => "Not Found"));
}
