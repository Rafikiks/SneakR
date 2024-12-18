<?php
header("Content-Type: application/json");

// Paramètres de connexion
$servername = "db";  // L'hôte de la base de données, ici, cela fait référence à un service Docker "db"
$username = "root";  // Nom d'utilisateur
$password = "rootpassword";  // Mot de passe
$dbname = "sneakers_db";  // Nom de la base de données
$charset = 'utf8mb4';  // Charset pour éviter les problèmes d'encodage

// DSN pour la connexion
$dsn = "mysql:host=$servername;dbname=$dbname;charset=$charset";

// Options pour la connexion PDO
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,  // Mode d'erreur de PDO
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,  // Récupération des données sous forme associative
    PDO::ATTR_EMULATE_PREPARES => false,  // Désactiver l'émulation de requêtes préparées pour une meilleure sécurité
];

try {
    // Connexion à la base de données avec PDO
    $pdo = new PDO($dsn, $username, $password, $options);

    // Exécution de la requête pour récupérer les sneakers avec les URLs des images
    $stmt = $pdo->query("SELECT name, brand, colorway, marketValue, gender, imageOriginale, imageThumbnail FROM sneakers LIMIT 50");
    
    // Récupération des résultats
    $sneakers = $stmt->fetchAll();

    // Retourner les résultats en JSON
    echo json_encode($sneakers);

} catch (\PDOException $e) {
    // En cas d'erreur, retourner le message d'erreur en JSON
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}
?>