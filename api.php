<?php
header("Content-Type: application/json");

// Get raw input from frontend
$input = json_decode(file_get_contents("php://input"), true);

// Transform input into Gondwana API format
$payload = [
    "Unit Type ID" => -2147483637, // test ID provided
    "Arrival" => date("Y-m-d", strtotime($input["Arrival"])),
    "Departure" => date("Y-m-d", strtotime($input["Departure"])),
    "Guests" => array_map(function($age) {
        return ["Age Group" => $age >= 12 ? "Adult" : "Child"];
    }, $input["Ages"])
];

// Send request to Gondwana API
$ch = curl_init("https://dev.gondwana-collection.com/Web-Store/Rates/Rates.php");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Return API response or error
if ($httpcode == 200 && $response) {
    echo $response;
} else {
    echo json_encode([
        "error" => "Failed to fetch rates",
        "status" => $httpcode,
        "payload_sent" => $payload
    ]);
}
