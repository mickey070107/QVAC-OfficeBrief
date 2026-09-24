const notes = document.querySelector("#notes");
const result = document.querySelector("#result");
const button = document.querySelector("#generate");
const status = document.querySelector("#status");

document.querySelector("#sample").onclick = () => {
  notes.value = `Weekly product meeting — 24 September
Priya will send the revised client proposal by Friday.
Arjun owns dashboard QA and should finish before the next review.
Marketing budget approved at ₹80,000.
The team agreed to move the beta launch to 10 October.
Next review meeting is 2 October at 11 AM.
Neha will prepare the launch email draft.`;
};

button.onclick = async () => {
  const text = notes.value.trim();
  if (!text) {
    result.textContent = "Please enter meeting notes first.";
    result.className = "result error";
    return;
  }

  button.disabled = true;
  button.innerHTML = "⟳ Running QVAC locally…";
  status.textContent = "QVAC • Loading / running";
  result.className = "result loading";
  result.textContent = "Loading the local model and generating your brief…";

  try {
    const response = await fetch("/api/brief", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({notes: text})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    result.textContent = data.output;
    result.className = "result";
    status.textContent = "QVAC • Local inference complete";
  } catch (e) {
    result.textContent = "Error: " + e.message;
    result.className = "result error";
    status.textContent = "QVAC • Error";
  } finally {
    button.disabled = false;
    button.innerHTML = "<span>✦</span> Create meeting brief";
  }
};