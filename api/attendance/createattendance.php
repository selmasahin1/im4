<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once '../../system/config.php';

// Validate input parameters
$date = isset($_POST['date']) ? $_POST['date'] : null;
$time_of_day = isset($_POST['time_of_day']) ? $_POST['time_of_day'] : null;
$attending = isset($_POST['attending']) ? $_POST['attending'] : null;
$user_id = $_SESSION['user_id'];


if (!$date || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Invalid or missing date. Use YYYY-MM-DD format."]);
    exit;
}

if (!$time_of_day || !in_array($time_of_day, ['Morning', 'Midday', 'Evening'])) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Invalid or missing time_of_day. Use 'Morning', 'Midday', or 'Evening'."]);
    exit;
}

if (!isset($attending) || !in_array($attending, [0, 1])) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Invalid or missing attending. Use 1 for attending or 0 for not attending."]);
    exit;
}

// Get user_profiles_id from user_profiles table
$sql = "SELECT id FROM user_profiles WHERE user_id = :user_id";
$stmt = $pdo->prepare($sql);
$stmt->execute([':user_id' => $user_id]);
$user_profile = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user_profile) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(["error" => "User profile not found."]);
    exit;
}

$user_profiles_id = $user_profile['id'];

// Check if a record already exists for this user, date and time
$check_sql = "
    SELECT id 
    FROM attendance 
    WHERE user_profiles_id = :user_profiles_id 
    AND date = :date 
    AND time_of_day = :time_of_day
";

$check_stmt = $pdo->prepare($check_sql);
$check_stmt->execute([
    ':user_profiles_id' => $user_profiles_id,
    ':date' => $date,
    ':time_of_day' => $time_of_day
]);

$existing_record = $check_stmt->fetch(PDO::FETCH_ASSOC);

if ($existing_record) {
    // Update existing record
    $sql = "
        UPDATE attendance 
        SET attending = :attending 
        WHERE id = :id
    ";
    
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([
        ':attending' => $attending,
        ':id' => $existing_record['id']
    ]);

    if ($success) {
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode(["status" => "success", "message" => "Attendance record updated."]);
    } else {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(["error" => "Failed to update attendance record."]);
    }
    exit;
}

// Insert into attendance table
$sql = "
    INSERT INTO attendance (date, attending, time_of_day, user_profiles_id)
    VALUES (:date, :attending, :time_of_day, :user_profiles_id)
";

$stmt = $pdo->prepare($sql);
$success = $stmt->execute([
    ':date' => $date,
    ':attending' => $attending,
    ':time_of_day' => $time_of_day,
    ':user_profiles_id' => $user_profiles_id
]);

if ($success) {
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode(["status" => "success", "message" => "Attendance record created."]);
} else {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Failed to create attendance record."]);
}

