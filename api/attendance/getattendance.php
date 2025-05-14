<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once '../../system/config.php';

$user_id = $_SESSION['user_id'];
$date = $_GET['date'] ?? null;

if (!$date || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing date."]);
    exit;
}

// Hole user_profiles_id
$sql = "SELECT id FROM user_profiles WHERE user_id = :user_id";
$stmt = $pdo->prepare($sql);
$stmt->execute([':user_id' => $user_id]);
$user_profile = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user_profile) {
    http_response_code(404);
    echo json_encode(["error" => "User profile not found."]);
    exit;
}

$user_profiles_id = $user_profile['id'];

// Hole bereits vorhandene Daten
$sql = "
    SELECT time_of_day, attending
    FROM attendance
    WHERE user_profiles_id = :user_profiles_id AND date = :date
";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':user_profiles_id' => $user_profiles_id,
    ':date' => $date
]);

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($results);
