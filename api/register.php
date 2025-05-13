<?php
// register.php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $firstname = trim($_POST['firstname'] ?? '');
    $lastname = trim($_POST['lastname'] ?? '');

    if (!$email || !$password || !$firstname || !$lastname) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "Email is already in use"]);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Start transaction
        $pdo->beginTransaction();

        // Insert into users
        $insertUser = $pdo->prepare("INSERT INTO users (email, password) VALUES (:email, :pass)");
        $insertUser->execute([
            ':email' => $email,
            ':pass' => $hashedPassword
        ]);

        // Get the new user's ID
        $userId = $pdo->lastInsertId();

        // Insert into user_profile
        $insertProfile = $pdo->prepare("INSERT INTO user_profiles (user_id, first_name, last_name) VALUES (:user_id, :first_name, :last_name)");
        $insertProfile->execute([
            ':user_id' => $userId,
            ':first_name' => $firstname,
            ':last_name' => $lastname
        ]);

        // Commit the transaction
        $pdo->commit();
        $_SESSION['user_id'] = $userId;
        $_SESSION['email'] = $email;

        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["status" => "error", "message" => "Registration failed"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>