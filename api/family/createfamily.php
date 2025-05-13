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


$action = $_POST['action'] ?? '';

if ($action === 'create') {
    // Generate a new family code
    $familyCode = bin2hex(random_bytes(3)); // 6-digit hex code

    // Fetch lastname from user_profiles
    $stmt = $pdo->prepare("SELECT last_name FROM user_profiles WHERE user_id = :uid");
    $stmt->execute([':uid' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || empty($user['last_name'])) {
        echo json_encode(["status" => "error", "message" => "User profile not found"]);
        exit;
    }

    $lastname = htmlspecialchars($user['last_name'], ENT_QUOTES, 'UTF-8');
    $familyName = "Familie " . $lastname;

    // Insert family into DB
    $stmt = $pdo->prepare("
    INSERT INTO family (name, family_code, admin_user_id)
    VALUES (:name, :code, :admin_user_id)
    ");
    $stmt->execute([
        ':name' => $familyName,
        ':code' => $familyCode,
        ':admin_user_id' => $user_id
    ]);

    $familyId = $pdo->lastInsertId();

    // Set family_id for user_profile
    $stmt = $pdo->prepare("UPDATE user_profiles SET family_id = :fid where user_id = :uid");
    $stmt->execute([
        ':fid' => $familyId,
        ':uid' => $user_id
    ]);

    echo json_encode(["status" => "success", "familycode" => $familyCode]);
    exit;

} elseif ($action === 'assign') {
    $code = trim($_POST['familycode'] ?? '');
    if (!$code) {
        echo json_encode(["status" => "error", "message" => "Kein Familiencode erhalten"]);
        exit;
    }

    // Lookup family ID
    $stmt = $pdo->prepare("SELECT id FROM family WHERE family_code = :code");
    $stmt->execute([':code' => $code]);
    $family = $stmt->fetch();

    if (!$family) {
        echo json_encode(["status" => "error", "message" => "Familiencode ungültig"]);
        exit;
    }

    // Set family_id for user_profile, admin = false
    $update = $pdo->prepare("UPDATE user_profiles SET family_id = :fid WHERE user_id = :uid");
    $update->execute([
        ':fid' => $family['id'],
        ':uid' => $user_id
    ]);

    echo json_encode(["status" => "success"]);
    exit;

} else {
    echo json_encode(["status" => "error", "message" => "Ungültige Aktion"]);
    exit;
}
