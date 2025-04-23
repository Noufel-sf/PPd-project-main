document.addEventListener('DOMContentLoaded', function () {
    // Form validation logic
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let email_error = document.getElementById("email_error");
    let password_error = document.getElementById("password_error");
    let form = document.getElementById("form");
    let responseMessage = document.getElementById("responseMessage");
    var email_check = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Reset error messages
        email_error.innerHTML = "";
        password_error.innerHTML = "";
        responseMessage.innerHTML = "";

        // Email validation
        if (email.value === '') {
            email_error.innerHTML = "You must fill your Email";
            return;
        } else if (!email.value.match(email_check)) {
            email_error.innerHTML = "Valid Email is required";
            return;
        }

        // Password validation
        if (password.value.length <= 8) {
            password_error.innerHTML = "Password cannot be less than 8 characters";
            return;
        } else if (password.value.length > 20) {
            password_error.innerHTML = "Password cannot be more than 20 characters";
            return;
        }

        // Prepare user data for login
        let userdata = {
            username: email.value, // Send email as username
            password: password.value,
        };

        console.log("Sending login request to /api/login/ with data:", userdata);

        try {
            const response = await fetch("/api/login/", {  // Use relative URL
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userdata)
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                // Store the access and refresh tokens
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
                responseMessage.innerHTML = '<p style="color: green;">Login successful!</p>';
                setTimeout(() => {
                    window.location.href = "/"; // Hardcode the home URL
                }, 2000);
            } else {
                responseMessage.innerHTML = `<p style="color: red;">Login failed: ${data.detail || JSON.stringify(data)}</p>`;
            }
        } catch (error) {
            console.error("Error in login:", error);
            responseMessage.innerHTML = '<p style="color: red;">Something went wrong. Please try again!</p>';
        }
    });

    // Add focus effects to inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.style.borderColor = '#4155E8';
            this.style.outline = 'none';
            this.style.boxShadow = '0 0 0 2px rgba(65, 85, 232, 0.2)';
        });

        input.addEventListener('blur', function () {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        });
    });

    // Making the navigation bar visible on small devices
    let open_nav = document.getElementById("open_nav");
    let nav_list = document.getElementById("nav_list");
    let state = false;

    open_nav.addEventListener("click", () => {
        if (!state) {
            nav_list.style.display = "flex";
            state = true;
        } else {
            nav_list.style.display = "none";
            state = false;
        }
    });

    // Logic to show the password
    let showPassIcon = document.getElementById("showpass");

    showPassIcon.addEventListener("click", () => {
        if (password.type === "password") {
            password.type = "text";
            showPassIcon.classList.remove("fa-eye");
            showPassIcon.classList.add("fa-eye-slash");
        } else {
            password.type = "password";
            showPassIcon.classList.remove("fa-eye-slash");
            showPassIcon.classList.add("fa-eye");
        }
    });
});