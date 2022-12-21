<?php
include_once 'conn.php';
include 'func.php';
if (strtoupper($_SERVER['REQUEST_METHOD']) == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $data['data_turbidity'] = convert_ntu($data['data_turbidity']);
    $data['data_ph'] = convert_ph($data['data_ph']);

    // 0000-00-00 00:00:00
    // data_ph, data_suhu_air, data_suhu_udara, data_turbidity, data_oksigen_terlarut, data_kelembapan_udara, created_at
    $sql = "INSERT INTO kolam_1(data_ph, data_suhu_air, data_suhu_udara, data_turbidity, data_kelembapan_udara) VALUES ({$data['data_ph']}, {$data['data_suhu_air']}, {$data['data_suhu_udara']}, {$data['data_turbidity']}, {$data['data_kelembapan_udara']})";

    try {
        $conn->exec($sql);
        http_response_code(200);
        echo json_encode(array('msg' => 'success'));
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(array('msg' => $e->getMessage()));
    }
}
