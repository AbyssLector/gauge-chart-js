<?php
include_once 'conn.php';

if (strtoupper($_SERVER['REQUEST_METHOD']) == 'GET') {
    if (isset($_GET['q']) && isset($_GET['p'])) {
        $duration = $_GET['q'];
        $mode = $_GET['p'];
        if (!$duration) {
            if ($mode == 1) {
                $query = "SELECT * FROM kolam_1 WHERE created_at > TIMESTAMP(DATE_SUB(NOW(), INTERVAL 1 day))";
            } else {
                $query = "SELECT * FROM kolam_2 WHERE created_at > TIMESTAMP(DATE_SUB(NOW(), INTERVAL 1 day))";
            }
            try {
                $result = $conn->query($query)->fetchAll();
                http_response_code(200);
                echo json_encode(array('msg' => 'success', $result));
            } catch (PDOException $e) {
                echo json_encode(array('msg' => $e->getMessage()));
            }
        } else {
            if ($mode == 1) {
                $query = "SELECT * FROM kolam_1 WHERE created_at > TIMESTAMP(DATE_SUB(NOW(), INTERVAL 7 day))";
            } else {
                $query = "SELECT * FROM kolam_2 WHERE created_at > TIMESTAMP(DATE_SUB(NOW(), INTERVAL 7 day))";
            }
            try {
                $result = $conn->query($query)->fetchAll();
                http_response_code(200);
                echo json_encode(array('msg' => 'success', $result));
            } catch (PDOException $e) {
                echo json_encode(array('msg' => $e->getMessage()));
            }
        }
    } else {
        http_response_code(400);
        echo json_encode(array('msg' => "Wrong params"));
    }
} else {
    http_response_code(400);
    echo json_encode(array('msg' => "Not Found"));
}
