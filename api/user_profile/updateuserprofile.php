<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once '../../system/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$first_name = $data['first_name'] ?? null;
$last_name = $data['last_name'] ?? null;

if (!$first_name || !$last_name) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(["error" => "First name and last name are required."]);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "UPDATE user_profiles SET first_name = :first_name, last_name = :last_name WHERE user_id = :user_id";
$stmt = $pdo->prepare($sql);
$success = $stmt->execute([
    ':first_name' => $first_name,
    ':last_name' => $last_name,
    ':user_id' => $user_id,
]);

header('Content-Type: application/json');

if ($success) {
    echo json_encode(["status" => "success", "message" => "Profile updated successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update profile."]);
}