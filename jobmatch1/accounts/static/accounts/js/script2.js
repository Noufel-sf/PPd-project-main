// ------------------ Script for the Counter ------------------
let valueDisplays = document.querySelectorAll(".num");
let interval = 5000;

valueDisplays.forEach((valueDisplay) => {
  let startValue = 0;
  let endValue = parseInt(valueDisplay.getAttribute("data-val"));
  let duration = Math.floor(interval / endValue);
  let counter = setInterval(function () {
    startValue += 1;
    valueDisplay.textContent = startValue;
    if (startValue === endValue) {
      clearInterval(counter);
    }
  }, duration);
});

// ------------------ Script for Job Form Validation and Submission ------------------
document.getElementById("save_info_btn").addEventListener("click", async function (e) {
  e.preventDefault(); 

  // Get input elements
  const title = document.getElementById("title_input");
  const domain = document.getElementById("domain_input");
  const location = document.getElementById("location_input");
  const salary = document.getElementById("salary_input");
  const period = document.getElementById("period_input");
  const requirement = document.getElementById("Requeriment_input");

  // Clear previous errors
  document.getElementById("title_error").innerText = "";
  document.getElementById("domain_error").innerText = "";
  document.getElementById("location_error").innerText = "";
  document.getElementById("salary_error").innerText = "";
  document.getElementById("period_error").innerText = "";
  document.getElementById("req_error").innerText = "";

  let hasError = false;

  if (title.value.trim() === "") {
    document.getElementById("title_error").innerText = "Job title is required";
    hasError = true;
  }
  if (domain.value.trim() === "") {
    document.getElementById("domain_error").innerText = "Domain is required";
    hasError = true;
  }
  if (location.value.trim() === "") {
    document.getElementById("location_error").innerText = "Location is required";
    hasError = true;
  }
  if (salary.value.trim() === "") {
    document.getElementById("salary_error").innerText = "Salary is required";
    hasError = true;
  }
  if (period.value.trim() === "") {
    document.getElementById("period_error").innerText = "Period is required";
    hasError = true;
  }
  if (requirement.value.trim() === "") {
    document.getElementById("req_error").innerText = "Requirement is required";
    hasError = true;
  }

  if (!hasError) {
    const job = {
      title: title.value.trim(),
      domain: domain.value.trim(),
      location: location.value.trim(),
      salary: salary.value.trim(),
      period: period.value.trim(),
      requirement: requirement.value.trim(),
    };

    // Send to backend using POST request with async/await
    try {
      const response = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        throw new Error("Failed to send job to the server");
      }

      const result = await response.json();
      console.log("Job sent to backend:", result);
      alert("Job submitted and saved successfully!");

      // Redirect after success
      window.location.href = "jobs.html";

    } catch (error) {
      console.error("Error sending job to backend:", error);
      alert("Error: could not send job to the server.");
    }
  }
});

// ------------------ Clear Tokens on Logout ------------------
function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    console.log("Tokens cleared from localStorage");
}

// ------------------ Clear Local Storage (Optional Utility) ------------------
// localStorage.removeItem("jobs");