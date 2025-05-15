<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once '../../system/config.php';

// Validate date parameter
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Invalid date format. Use YYYY-MM-DD"]);
    exit;
}

$user_id = $_SESSION['user_id'];


// Get family_id and all attendance records for the family on the specified date

$sql = "
    SELECT 
        up.id as user_profiles_id,
        up.first_name,
        up.last_name,
        a.attending,
        a.time_of_day
    FROM user_profiles up
    LEFT JOIN (
        SELECT * FROM attendance WHERE DATE(date) = :date
    ) a ON up.id = a.user_profiles_id
    WHERE up.family_id = (
        SELECT family_id FROM user_profiles WHERE user_id = :user_id
    )
    ORDER BY up.first_name
";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':user_id' => $user_id,
    ':date' => $date
]);

$records = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode([
    "status" => "success",
    "date" => $date,
    "records" => $records
]);


