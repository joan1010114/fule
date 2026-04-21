<?php
require __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cache-Control, Pragma');
// 絕對不要快取 API 回應
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
$key = $_GET['key'] ?? '';
if (empty($key) || strlen($key) > 255) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid key']); exit;
}
$method = $_SERVER['REQUEST_METHOD'];
try {
    $db = getDB();
    if ($method === 'GET') {
        $stmt = $db->prepare('SELECT payload, UNIX_TIMESTAMP(updated_at) AS ts FROM events WHERE id = ?');
        $stmt->execute([$key]);
        $row = $stmt->fetch();
        if (!$row) {
            echo json_encode(['key'=>$key,'value'=>null,'shared'=>true,'ts'=>0]);
        } else {
            echo json_encode(['key'=>$key,'value'=>$row['payload'],'shared'=>true,'ts'=>(int)$row['ts']]);
        }
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['value']) || !is_string($input['value'])) {
            http_response_code(400); echo json_encode(['error'=>'value must be a string']); exit;
        }
        $stmt = $db->prepare('INSERT INTO events (id, payload) VALUES (?, ?) ON DUPLICATE KEY UPDATE payload = VALUES(payload)');
        $stmt->execute([$key, $input['value']]);
        echo json_encode(['key'=>$key,'value'=>$input['value'],'shared'=>true]);
    } else {
        http_response_code(405); echo json_encode(['error'=>'Method not allowed']);
    }
} catch (PDOException $e) {
    http_response_code(500); echo json_encode(['error'=>$e->getMessage()]);
}
