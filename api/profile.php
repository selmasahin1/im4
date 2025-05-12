<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once '../system/config.php';

$user_id = $_SESSION['user_id'];

$sql = "SELECT first_name, last_name FROM user_profiles WHERE user_id = :user_id";
$stmt = $pdo->prepare($sql);
$stmt->execute([':user_id' => $user_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

if ($row) {
    echo json_encode([
        "status" => "success",
        "user_id" => $user_id,
        "first_name" => $row["first_name"],
        "last_name" => $row["last_name"]
    ]);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Profile not found"]);
}