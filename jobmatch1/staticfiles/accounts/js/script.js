document.addEventListener('DOMContentLoaded', function () {
    // Navbar toggle functionality
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            console.log("Menu button clicked!");
            navMenu.classList.toggle("active");
        });
    }

    // Form submit functionality
    const form = document.getElementById('signupForm');
    const responseMessage = document.getElementById('responseMessage');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission

            console.log("Form submitted");

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const role = document.getElementById('role').value;
            const password = document.getElementById('password').value.trim();
            const sex = document.getElementById('sex').value;
            const confirmPassword = document.getElementById('confirmPassword').value.trim();

            // Basic form validation
            if (!firstName || !lastName || !email || !role || !password || !confirmPassword || !sex) {
                responseMessage.innerHTML = '<p style="color: red;">Please fill in all fields</p>';
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                responseMessage.innerHTML = '<p style="color: red;">Please enter a valid email address</p>';
                return;
            }

            // Password validation (minimum 8 characters)
            if (password.length < 8) {
                responseMessage.innerHTML = '<p style="color: red;">Password must be at least 8 characters long</p>';
                return;
            }

            // Confirm password validation
            if (password !== confirmPassword) {
                responseMessage.innerHTML = '<p style="color: red;">Passwords do not match</p>';
                return;
            }

            // Create user data object for signup
            const userData = {
                username: email,
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password,
                role: role,
                sex: sex
            };

            try {
                // Send POST request to signup endpoint
                const signupResponse = await fetch("/api/signup/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                const signupData = await signupResponse.json();

                if (signupResponse.ok) {
                    // Store the tokens in localStorage
                    localStorage.setItem("access_token", signupData.access);
                    localStorage.setItem("refresh_token", signupData.refresh);

                    responseMessage.innerHTML = '<p style="color: green;">User registered and logged in successfully!</p>';
                    form.reset();
                    setTimeout(() => {
                        window.location.href = "/"; // Redirect to home page
                    }, 2000);
                } else {
                    // Improved error handling for signup
                    let errorMessage = "Registration failed: ";
                    if (signupData.email) {
                        errorMessage += signupData.email[0];
                    } else if (signupData.message) {
                        errorMessage += signupData.message;
                    } else {
                        errorMessage += JSON.stringify(signupData);
                    }
                    responseMessage.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
                }
            } catch (error) {
                console.error("Error in sign-up:", error);
                responseMessage.innerHTML = '<p style="color: red;">Network error: Unable to reach the server. Please try again!</p>';
            }
        });
    }

    // Password visibility toggle functionality
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");
            } else {
                passwordInput.type = "password";
                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");
            }
        });
    }

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener("click", function () {
            if (confirmPasswordInput.type === "password") {
                confirmPasswordInput.type = "text";
                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");
            } else {
                confirmPasswordInput.type = "password";
                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");
            }
        });
    }

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
});