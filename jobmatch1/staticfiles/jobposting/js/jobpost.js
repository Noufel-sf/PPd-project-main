document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("job-posting-form");
    const title = document.getElementById("title_input");
    const domain = document.getElementById("domain_input");
    const location = document.getElementById("location_input");
    const salary = document.getElementById("salary_input");
    const period = document.getElementById("period_input");
    const requirement = document.getElementById("Requeriment_input");
  
    const title_error = document.getElementById("title_error");
    const domain_error = document.getElementById("domain_error");
    const location_error = document.getElementById("location_error");
    const salary_error = document.getElementById("salary_error");
    const period_error = document.getElementById("period_error");
    const req_error = document.getElementById("req_error");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault(); 
  
      // Clear previous errors
      title_error.innerText = "";
      domain_error.innerText = "";
      location_error.innerText = "";
      salary_error.innerText = "";
      period_error.innerText = "";
      req_error.innerText = "";
  
      let hasError = false;
  
      if (title.value.trim() === "") {
        title_error.innerText = "Job title is required";
        hasError = true;
      }
      if (domain.value.trim() === "") {
        domain_error.innerText = "Domain is required";
        hasError = true;
      }
      if (location.value.trim() === "") {
        location_error.innerText = "Location is required";
        hasError = true;
      }
      if (salary.value.trim() === "") {
        salary_error.innerText = "Salary is required";
        hasError = true;
      }
      if (period.value.trim() === "") {
        period_error.innerText = "Period is required";
        hasError = true;
      }
      if (requirement.value.trim() === "") {
        req_error.innerText = "Requirement is required";
        hasError = true;
      }
  
      if (!hasError) {
        const token = localStorage.getItem("access_token");
        if (!token) {
          req_error.innerHTML = '<p style="color: red;">Please log in to post a job.</p>';
          return;
        }
  
        const job = {
          title: title.value.trim(),
          domain: domain.value.trim(),
          location: location.value.trim(),
          salary: salary.value.trim(),
          period: period.value.trim(),
          requirements: requirement.value.trim(),
        };
  
        try {
          const response = await fetch("/api/job-posting/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(job),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            req_error.innerHTML = '<p style="color: green;">Job posted successfully!</p>';
            title.value = "";
            domain.value = "";
            location.value = "";
            salary.value = "";
            period.value = "";
            requirement.value = "";
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          } else {
            let errorMessage = "Job posting failed: ";
            if (data.message) {
              errorMessage += data.message;
            } else {
              errorMessage += JSON.stringify(data);
            }
            req_error.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
          }
        } catch (error) {
          console.error("Error sending job to backend:", error);
          req_error.innerHTML = '<p style="color: red;">Network error: Unable to reach the server. Please try again!</p>';
        }
      }
    });
  
    const profile_icon = document.getElementById("profile_icon");
    let is_profile_icon = false;
    profile_icon.addEventListener("click", () => {
      if (!is_profile_icon) {
        let overlay = document.createElement("div");
        overlay.id = "overlay";
        let ul = document.createElement("ul");
        let li_1 = document.createElement("li");
        let li_2 = document.createElement("li");
        li_1.innerHTML = "profile";
        li_2.innerHTML = "logout";
        ul.appendChild(li_1);
        ul.appendChild(li_2);
        overlay.appendChild(ul);
        document.body.appendChild(overlay);
        is_profile_icon = true;
      } else {
        let overlay = document.getElementById("overlay");
        overlay.remove();
        is_profile_icon = false;
      }
    });
  });