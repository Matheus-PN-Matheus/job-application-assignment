<?php
header("Content-Type: application/json");

// Get raw input
$input = json_decode(file_get_contents("php://input"), true);

// For now, just echo back the input (we’ll improve this later)
echo json_encode([
    "message" => "API is working!",
    "your_input" => $input
]);
