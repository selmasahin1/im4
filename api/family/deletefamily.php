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

// Update the user_profiles table to set family_id to NULL for the logged-in user
$sql = "UPDATE user_profiles SET family_id = NULL WHERE user_id = :user_id";

$stmt = $pdo->prepare($sql);
$success = $stmt->execute([':user_id' => $user_id]);

header('Content-Type: application/json');

if ($success) {
    echo json_encode(["status" => "success", "message" => "Family removed successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to remove family."]);
}