<?php
header("Content-Type: application/json");

$host = 'localhost';
$db = 'sneakers_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Récupérer les sneakers depuis la base de données
    $stmt = $pdo->query("SELECT * FROM sneakers LIMIT 50");
    $sneakers = $stmt->fetchAll();

    echo json_encode($sneakers);
} catch (\PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}