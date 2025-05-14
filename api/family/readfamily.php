<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once '../../system/config.php';

$user_id = $_SESSION['user_id'];

// Get family name based on user_id through user_profiles
$sql = "
    SELECT f.name as family_name
    FROM family f
    JOIN user_profiles up ON f.id = up.family_id
    WHERE up.user_id = :user_id
";

$stmt = $pdo->prepare($sql);
$stmt->execute([':user_id' => $user_id]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

if ($result) {
    echo json_encode([
        "status" => "success",
        "family_name" => $result['family_name']
    ]);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Family not found"]);
}