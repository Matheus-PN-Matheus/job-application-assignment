document.getElementById("rateForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const ages = document.getElementById("ages").value
    .split(",")
    .map(a => parseInt(a.trim()));

  const payload = {
    "Unit Name": document.getElementById("unitName").value,
    "Arrival": document.getElementById("arrival").value,
    "Departure": document.getElementById("departure").value,
    "Occupants": parseInt(document.getElementById("occupants").value),
    "Ages": ages
  };

  // Send to backend
  const res = await fetch("api.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "";

  if (data.error) {
    resultDiv.textContent = "Error: " + data.error;
  } else {
    let output = `
      Unit: ${payload["Unit Name"]}<br>
      Dates: ${payload["Arrival"]} → ${payload["Departure"]}<br>
      Occupants: ${payload["Occupants"]}<br>
      Total Charge: ${data["Total Charge"]}<br>
      Rooms Available: ${data["Rooms"]}<br><br>
      <strong>Rate Details:</strong><br>
    `;

    data.Legs.forEach((leg, i) => {
      output += `
        Option ${i+1}: ${leg["Special Rate Description"]}<br>
        - Rate Code: ${leg["Special Rate Code"]}<br>
        - Daily Rate: ${leg["Effective Average Daily Rate"]}<br>
        - Total: ${leg["Total Charge"]}<br><br>
      `;
    });

    resultDiv.innerHTML = output;
  }
});
